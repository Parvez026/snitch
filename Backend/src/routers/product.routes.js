import express from "express"
import { authenticateSeller } from "../middleware/auth.middleware.js"
import { productValidator } from "../validator/product.validator.js"
import multer from "multer"
import { createProduct, getSellerProduct } from "../controllers/product.controller.js"

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
})

const router=express.Router()



router.post("/", authenticateSeller, upload.array('images', 7), productValidator, createProduct)

router.get("/seller",authenticateSeller,getSellerProduct)

export default router