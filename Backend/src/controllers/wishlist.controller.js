import mongoose from "mongoose";
import productModel from "../models/product.model.js";
import wishlistModel from "../models/wishlist.model.js";


export const addToWishlist=async(req,res)=>{

    const {productId}=req.params
    const userId=req.user.id

    const product=await productModel.findById(productId)

    if(!product){
        return res.status(404).json({
            message:"Product is not found",
            success:false
        })
    }

    let wishlist=await wishlistModel.findOne({
        user:userId
    })

    if(!wishlist){
        wishlist=await wishlistModel.create({
            user:userId,
            products:[productId]
        })

        return res.status(201).json({
        message:"Product add to wishlist successfully",
        success:true,
        wishlist
      })
    }

    const alreadyExist=wishlist.products.some((id)=>id.toString()===productId)

    if(alreadyExist){
        return res.status(409).json({
            message:"Product already exist in wishlist"
        })
    }

    wishlist.products.push(productId)
    await wishlist.save()

      return res.status(200).json({
      message: "Product added to wishlist",
      success:true,
      wishlist,
    });
}

export const removeFromWishlist=async(req,res)=>{
    const {productId}=req.params
    const userId=req.user.id

    const wishlist=await wishlistModel.findOne({
        user:userId
    })

    if(!wishlist){
        return res.status(404).json({
            message:"Wishlist not found",
            success:false
        })
    }

    const productExist=wishlist.products.some((id)=>id.toString()===productId)
    
    if(!productExist){
        return res.status(404).json({
            message:"Product is not found in wishlist",
            success:false
        })
    }

    wishlist.products=wishlist.products.filter((id)=>id.toString()!==productId)

    await wishlist.save()

    return res.status(200).json({
        message:"Product is remove from wishlist",
        success:true,
        wishlist
    })
  
}

export const getWishlist=async(req,res)=>{
    const userId=req.user.id

    const wishlist=await wishlistModel.findOne({
        user:userId
    }).populate("products")

    if(!wishlist){
        return res.status(200).json({
            message:"Wishlist is empty",
            success:true,
            wishlist:[]
        })
    }

    return res.status(200).json({
        message:"Wishlist is fetched successfully",
        success:true,
        wishlist:wishlist.products
    })
}