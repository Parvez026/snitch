import express from "express"
import {authenticateUser} from "../middleware/auth.middleware.js"
import validateAddress from "../validator/address.validator.js"

const addressRouter=express.Router()

addressRouter.post("/create",authenticateUser,validateAddress)



export default addressRouter