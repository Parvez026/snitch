
import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

// Delivery address snapshot
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
  { _id: false }
);

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

    // Selected delivery address snapshot
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
  { timestamps: true }
);

const paymentModel = mongoose.model("payment", paymentSchema);

export default paymentModel;
