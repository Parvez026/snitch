import express from "express";
import { authenticateSeller, authenticateUser } from "../middleware/auth.middleware.js";
import {
  cartValidator,
  incrementCartItemQuantityValidator,
} from "../validator/cart.validator.js";
import {
  addToCart,
  getCart,
  incrementCartItemQuantity,
  decrementCartItemQuantity,
  removeCartItem,
  creteOrderController,
  verifyOrderController,
  getOrderDetailsController,
  getMyOrdersController,
  getSellerOrdersController,
  updateSellerOrderStatusController,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post(
  "/add/:productId/:variantId",
  authenticateUser,
  cartValidator,
  addToCart,
);

router.get("/", authenticateUser, getCart);

router.patch(
  "/quantity/increment/:productId/:variantId",
  authenticateUser,
  incrementCartItemQuantityValidator,
  incrementCartItemQuantity,
);

router.patch(
  "/quantity/decrement/:productId/:variantId",
  authenticateUser,
  incrementCartItemQuantityValidator,
  decrementCartItemQuantity,
);

router.delete(
    "/remove/:productId/:variantId",
  authenticateUser,
  incrementCartItemQuantityValidator,
  removeCartItem,
);

router.post("/payment/create/order", authenticateUser, creteOrderController);

router.post("/payment/verify/order", authenticateUser, verifyOrderController);

router.get("/my-orders", authenticateUser, getMyOrdersController);

router.get("/order/:orderId", authenticateUser, getOrderDetailsController);

router.get("/seller/orders",authenticateSeller,getSellerOrdersController);

router.patch(
  "/seller/orders/:orderId/status",
  authenticateSeller,
  updateSellerOrderStatusController
);
export default router;
