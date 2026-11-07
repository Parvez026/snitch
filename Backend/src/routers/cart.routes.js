import express from "express"
import { authenticateUser } from "../middleware/auth.middleware.js"
import { cartValidator, incrementCartItemQuantityValidator } from "../validator/cart.validator.js"
import { addToCart, getCart, incrementCartItemQuantity,decrementCartItemQuantity } from "../controllers/cart.controller.js"

const router=express.Router()


router.post("/add/:productId/:variantId",authenticateUser,cartValidator,addToCart)

router.get("/",authenticateUser,getCart)

router.patch("/quantity/increment/:productId/:variantId",authenticateUser,incrementCartItemQuantityValidator,incrementCartItemQuantity)

router.patch("/quantity/decrement/:productId/:variantId",authenticateUser,incrementCartItemQuantityValidator,decrementCartItemQuantity)

export default router