import mongoose from "mongoose";

const addressSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        trim:true
    },
    addressLine: {
      type: String,
      required: true,
      trim: true,
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pincode:{
      type:String,
      required:true
    },
     landmark: {
      type: String,
    },
      addressType: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
     isDefault: {
      type: Boolean,
      default: false,
    },
},{timestamps:true})


const addressModel=mongoose.model("address",addressSchema)

export default addressModel