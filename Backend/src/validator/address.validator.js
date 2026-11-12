import {body ,validationResult} from "express-validator"


const validateRequest=(req,res,next)=>{
    const errors=validationResult(req)

    if(!errors.isEmpty()){
         return res.status(400).json({ errors: errors.array() });
    }
    next()
}

export const validateAddress=[
    body("addressLine").notEmpty().withMessage("Address line is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("state").notEmpty().withMessage("State is required"),
    body("pincode").notEmpty().withMessage("Pincode is required").isPostalCode("IN").withMessage("Invalid pincode"),
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("phone").notEmpty().withMessage("Phone number is required").isMobilePhone("en-IN").withMessage("Invalid phone number"),
    body("email").optional().isEmail().withMessage("Invalid email address"),
    body("landmark").optional(),
    body("addressType").optional().isIn(["home", "work", "other"]).withMessage("Invalid address type"),
    body("isDefault").optional().isBoolean().withMessage("isDefault must be a boolean value"),

    validateRequest()
]