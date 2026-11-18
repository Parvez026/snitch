import express from "express"
import { authenticateUser } from "../middleware/auth.middleware.js"
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js"

const router=express.Router()


router.post("/add/:productId",authenticateUser,addToWishlist)

router.delete("/remove/:productId",authenticateUser,removeFromWishlist)

router.get("/get-wishlist",authenticateUser,getWishlist)

export default router