import mongoose from "mongoose";
import { stockOfVariant } from "../dao/product.dao.js";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { getCartDetails } from "../dao/cart.dao.js";
import { createOrder } from "../services/payment.service.js";
import paymentModel from "../models/payment.model.js";
import addressModel from "../models/address.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";

export const addToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.body;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product or variant not found",
      success: false,
    });
  }

  const stock = await stockOfVariant(productId, variantId);

  const cart =
    (await cartModel.findOne({ user: req.user._id })) ||
    (await cartModel.create({ user: req.user._id }));

  const isProductAlreadyInCart = cart.items.some(
    (item) =>
      item.product.toString() === productId &&
      item.variant?.toString() === variantId,
  );

  if (isProductAlreadyInCart) {
    const quantityInCart = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.toString() === variantId,
    ).quantity;

    if (quantityInCart + quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
        success: false,
      });
    }

    await cartModel.findOneAndUpdate(
      {
        user: req.user._id,
        "items.product": productId,
        "items.variant": variantId,
      },
      { $inc: { "items.$.quantity": quantity } },
      { new: true },
    );

    return res.status(200).json({
      message: "Cart updated successfully",
      success: true,
    });
  }

  if (quantity > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left in stock`,
      success: false,
    });
  }

  cart.items.push({
    product: productId,
    variant: variantId,
    quantity,
    price: product.price,
  });

  await cart.save();

  return res.status(200).json({
    message: "Product added to cart successfully",
    success: true,
  });
};

export const getCart = async (req, res) => {
  const user = req.user;

  let cart = await getCartDetails(user._id);

  if (!cart) {
    cart = await cartModel.create({ user: user._id });
  }

  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
};

export const incrementCartItemQuantity = async (req, res) => {
  const { productId, variantId } = req.params;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product or variant not found",
      success: false,
    });
  }

  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }

  const stock = await stockOfVariant(productId, variantId);

  const itemQuantityInCart =
    cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.toString() === variantId,
    ).quantity || 0;

  if (itemQuantityInCart + 1 > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left in stock. and you already have ${itemQuantityInCart} items in your cart`,
      success: false,
    });
  }

  await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
      "items.product": productId,
      "items.variant": variantId,
    },
    { $inc: { "items.$.quantity": 1 } },
    { new: true },
  );

  return res.status(200).json({
    message: "Cart item quantity incremented successfully",
    success: true,
  });
};

export const decrementCartItemQuantity = async (req, res) => {
  const { productId, variantId } = req.params;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(404).json({
      message: "product or variant is not found",
      success: false,
    });
  }

  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      message: "cart not found",
      success: false,
    });
  }

  const itemQuantityInCart =
    cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.toString() === variantId,
    ).quantity || 0;

  if (itemQuantityInCart - 1 < 0) {
    return res.status(400).json({
      message: "Cannot decrement quantity below 0",
      success: false,
    });
  }

  await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
      "items.product": productId,
      "items.variant": variantId,
    },
    { $inc: { "items.$.quantity": -1 } },
    { new: true },
  );

  return res.status(200).json({
    message: "Cart quantity decremented successfully",
    success: true,
  });
};

export const removeCartItem = async (req, res) => {
  const { productId, variantId } = req.params;

  await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { items: { product: productId, variant: variantId } } },
    { new: true },
  );

  return res.status(200).json({
    message: "Cart item removed successfully",
    success: true,
  });
};


export const creteOrderController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.body;

    const address = await addressModel.findOne({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        message: "Delivery address not found",
        success: false,
      });
    }

    const cart = await getCartDetails(userId);

    if (!cart || !cart.items?.length) {
      return res.status(400).json({
        message: "Cart is empty",
        success: false,
      });
    }

    // STEP 1: Group cart items seller-wise
    const sellerOrdersMap = {};

    cart.items.forEach((item) => {
      const sellerId = item.product.sellerDetails?._id;

      if (!sellerId) {
        throw new Error(
          `Seller not found for product: ${item.product.title}`
        );
      }

      const sellerKey = sellerId.toString();

      if (!sellerOrdersMap[sellerKey]) {
        sellerOrdersMap[sellerKey] = {
          seller: sellerId,
          items: [],
          orderStatus: "confirmed",
        };
      }

      sellerOrdersMap[sellerKey].items.push({
        title: item.product.title,
        productId: item.product._id,
        variantId: item.variant,
        quantity: item.quantity,
        images: item.product.variants.images || item.product.images,
        description: item.product.description,
        price: {
          amount: item.product.variants.price.amount,
          currency: item.product.variants.price.currency,
        },
      });
    });

    // STEP 2: Convert grouped sellers into array
    const sellerOrders = Object.values(sellerOrdersMap);

    // STEP 3: Create one Razorpay order
    const order = await createOrder({
      amount: cart.totalPrice,
      currency: cart.currency,
    });

    // STEP 4: Create one payment document
    const payment = await paymentModel.create({
      user: userId,

      razorpay: {
        orderId: order.id,
      },

      price: {
        amount: cart.totalPrice,
        currency: cart.currency,
      },

      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        email: address.email,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        landmark: address.landmark,
        addressType: address.addressType,
      },

      // All products for customer
      orderItems: cart.items.map((item) => ({
        title: item.product.title,
        productId: item.product._id,
        variantId: item.variant,
        quantity: item.quantity,
        images: item.product.variants.images || item.product.images,
        description: item.product.description,
        price: {
          amount: item.product.variants.price.amount,
          currency: item.product.variants.price.currency,
        },
      })),

      // Seller-wise products
      sellerOrders,
    });

    return res.status(200).json({
      message: "Order create successfully",
      success: true,
      order,
    });

  } catch (error) {
    console.log("Create Order Error:", error);

    return res.status(500).json({
      message: error.message || "Unable to create order",
      success: false,
    });
  }
};


export const verifyOrderController = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const payment = await paymentModel.findOne({
    "razorpay.orderId": razorpay_order_id,
    status: "pending",
  });

  if (!payment) {
    return res.status(400).json({
      message: "Payment not found",
      success: false,
    });
  }

  const isPaymentValid = validatePaymentVerification(
    {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    },
    razorpay_signature,
    config.RAZORPAY_KEY_SECRET,
  );

  if (!isPaymentValid) {
    payment.status = "failed";
    await payment.save();

    return res.status(400).json({
      message: "Payment verification failed",
      success: false,
    });
  }

  payment.status = "paid";

  payment.razorpay.paymentId = razorpay_payment_id;
  payment.razorpay.signature = razorpay_signature;

  await payment.save();

  return res.status(200).json({
    message: "Payment verified successfully",
    success: true,
  });
};

export const getOrderDetailsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await paymentModel.findOne({
      "razorpay.orderId": orderId,
        user: userId,
      }).select("-sellerOrders");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Order details fetched successfully",
      success: true,
      order,
    });
  } catch (error) {
    console.log("Get order details error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getMyOrdersController = async (req, res) => {
    const userId = req.user._id;
  
    const orders = await paymentModel
    .find({ user: userId })
     .select("-sellerOrders")
     .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      orders,
    });
};


export const getSellerOrdersController = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders = await paymentModel.find({
      status: "paid",
      "sellerOrders.seller": sellerId,
    }).sort({ createdAt: -1 });

    const sellerOrders = orders.map((order) => {
      const sellerOrder = order.sellerOrders.find(
        (item) => item.seller.toString() === sellerId.toString()
      );

      return {
        orderId: order._id,
        razorpayOrderId: order.razorpay.orderId,
        customer: {
          fullName: order.shippingAddress.fullName,
          phone: order.shippingAddress.phone,
          address: order.shippingAddress,
        },
        items: sellerOrder.items,
        orderStatus: sellerOrder.orderStatus,
        createdAt: order.createdAt,
      };
    });

    return res.status(200).json({
      message: "Seller orders fetched successfully",
      success: true,
      orders: sellerOrders,
    });

  } catch (error) {
    console.log("Get Seller Orders Error:", error);

    return res.status(500).json({
      message: "Unable to fetch seller orders",
      success: false,
    });
  }
};


export const updateSellerOrderStatusController = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: "Invalid order status",
        success: false,
      });
    }

    const order = await paymentModel.findOne({
      _id: orderId,
      status: "paid",
      "sellerOrders.seller": sellerId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    // Find this seller's order
    const sellerOrder = order.sellerOrders.find(
      (item) => item.seller.toString() === sellerId.toString()
    );

    if (!sellerOrder) {
      return res.status(404).json({
        message: "Seller order not found",
        success: false,
      });
    }

    // Update seller's individual status
    sellerOrder.orderStatus = orderStatus;

    // Calculate one common status for the buyer
    const statuses = order.sellerOrders.map(
      (item) => item.orderStatus
    );

    if (statuses.every((status) => status === "cancelled")) {
      order.orderStatus = "cancelled";
    } else {
      const activeStatuses = statuses.filter(
        (status) => status !== "cancelled"
      );

      const statusPriority = {
        confirmed: 1,
        processing: 2,
        shipped: 3,
        delivered: 4,
      };

      // Buyer sees the least advanced status
      order.orderStatus = activeStatuses.reduce(
        (currentStatus, status) =>
          statusPriority[status] < statusPriority[currentStatus]
            ? status
            : currentStatus,
        activeStatuses[0]
      );
    }

    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      success: true,
      orderStatus: sellerOrder.orderStatus,
      buyerOrderStatus: order.orderStatus,
    });

  } catch (error) {
    console.log("Update Seller Order Status Error:", error);

    return res.status(500).json({
      message: "Unable to update order status",
      success: false,
    });
  }
};





