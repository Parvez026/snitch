import addressModel from "../models/address.model"


export const createAddress=async(req,res)=>{
    const userId=req.user._id

      const {fullName,phone,email,addressLine,city,state,pincode,landmark,addressType, isDefault,} = req.body;

      const existingAddress=await addressModel.findOne({
       user:userId
      })


      const makeDefault=isDefault||!existingAddress

      if(makeDefault){
        await addressModel.updateMany(
            {user:userId},
            {$set:{isDefault:false}}
        )
      }

      const address=await addressModel.create({
      user: userId,
      fullName,
      phone,
      email,
      addressLine,
      city,
      state,
      pincode,
      landmark,
      addressType,
      isDefault: makeDefault,
      })
}