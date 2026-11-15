import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

//ADDRESS
const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: String,
    addressLine: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    landmark: String,
    addressType: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
  },
  { _id: false },
);

//PAYMENT
const paymentSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    sellerOrders: [
      {
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        items: [
          {
            title: String,
            productId: mongoose.Schema.Types.ObjectId,
            variantId: mongoose.Schema.Types.ObjectId,
            quantity: Number,
            images: [{ url: String }],
            description: String,
            price: priceSchema,
          },
        ],
        orderStatus: {
          type: String,
          enum: [
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
          ],
          default: "confirmed",
        },
      },
    ],

    price: {
      type: priceSchema,
      required: true,
    },

    razorpay: {
      orderId: String,
      paymentId: String,
      signature: String,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    orderItems: [
      {
        title: String,
        productId: mongoose.Schema.Types.ObjectId,
        variantId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        images: [{ url: String }],
        description: String,
        price: priceSchema,
      },
    ],
  },
  { timestamps: true },
);

const paymentModel = mongoose.model("payment", paymentSchema);

export default paymentModel;
