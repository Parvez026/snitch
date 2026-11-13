import express from "express"
import {authenticateUser} from "../middleware/auth.middleware.js"
import {validateAddress} from "../validator/address.validator.js"
import { createAddress, deleteAddress, getAddress, setDefaultAddress, updateAddress } from "../controllers/address.controller.js"

const addressRouter=express.Router()

addressRouter.post("/create",authenticateUser,validateAddress,createAddress)

addressRouter.get("/get-address",authenticateUser,getAddress)

addressRouter.patch("/:addressId",authenticateUser,updateAddress)

addressRouter.delete("/:addressId",authenticateUser,deleteAddress)

addressRouter.patch("/:addressId/default",authenticateUser,setDefaultAddress);

export default addressRouter