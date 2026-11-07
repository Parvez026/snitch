import express from "express"
import { authenticateUser } from "../middleware/auth.middleware.js"
import { cartValidator } from "../validator/cart.validator.js"
import { addToCart } from "../controllers/cart.controller.js"

const router=express.Router()


router.post("/add/:productId/:variantId",authenticateUser,cartValidator,addToCart)

router.get("/",authenticateUser)

export default router