import { body,validationResult } from "express-validator";

const validateRequest=(req)=>{
   const error=validationResult(req)
   if(!error.isEmpty()){
    return res.status(400).json({errors:error.array()})
   }
}

export const productValidator=[
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("priceAmount").notEmpty().withMessage("Price amount is required"),
    body("priceCurrency")
        .notEmpty()
        .withMessage("Price currency is required")
        .isIn(["USD","EUR","GBP","INR"])
        .withMessage("Price currency must be one of USD, EUR, GBP, INR"),
        
        validateRequest
    ]
