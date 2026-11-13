import addressModel from "../models/address.model.js";

export const createAddress = async (req, res) => {
  const userId = req.user._id;

  const {
    fullName,
    phone,
    email,
    addressLine,
    city,
    state,
    pincode,
    landmark,
    addressType,
    isDefault,
  } = req.body;

  const existingAddress = await addressModel.findOne({
    user: userId,
  });

  const makeDefault = isDefault || !existingAddress;

  if (makeDefault) {
    await addressModel.updateMany(
      { user: userId },
      { $set: { isDefault: false } },
    );
  }

  const address = await addressModel.create({
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
  });

  return res.status(201).json({
    message: "Address created successfully",
    success: true,
    address,
  });
};

export const getAddress = async (req, res) => {
  const userId = req.user._id;

  const addresses = await addressModel
    .find({
      user: userId,
    })
    .sort({ isDefault: -1, createdAt: -1 });

  return res.status(200).json({
    message: "Address fetched successfully",
    success: true,
    addresses,
  });
};

export const updateAddress = async (req, res) => {
  const userId = req.user._id;
  const { addressId } = req.params;

  const allowedField = [
    "fullName",
    "phone",
    "email",
    "addressLine",
    "city",
    "state",
    "pincode",
    "landmark",
    "addressType",
  ];

  const updateData = {};

  allowedField.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const address = await addressModel.findOneAndUpdate(
    {
      _id: addressId,
      user: userId,
    },
    { $set: updateData },
    { new: true },
  );

  if (!address) {
    return res.status(404).json({
      message: "Address not found",
      success: false,
    });
  }

  return res.status(200).json({
    message: "Address updated successfully",
    success: true,
    address,
  });
};

export const deleteAddress=async(req,res)=>{
    const userId=req.user._id
    const {addressId}=req.params

    const address=await addressModel.findOneAndDelete({
        _id:addressId,
        user:userId
    })

    if(!address){
        return res.status(404).json({
            message:"Address not found",
            success:false
        })
    }

    if(address.isDefault){
        const nextAddress=await addressModel.findOne({
            user:userId
        })

        if(nextAddress){
            nextAddress.isDefault=true
            await nextAddress.save()
        }
    }

     return res.status(200).json({
         message: "Address deleted successfully",
         success: true,
    });
}

export const setDefaultAddress=async(req,res)=>{
    const userId=req.user._id
    const {addressId}=req.params

    const address=await addressModel.findOne({
        _id:addressId,
        user:userId
    })

    if(!address){
        return res.status(404).json({
            message:"Address not found",
            success:false
        })
    }

    await addressModel.updateMany(
        {user:userId},
        {$set:{isDefault:false}}
    )

    address.isDefault=true
    await address.save()

    return res.status(200).json({
          message: "Default address updated successfully",
          success:true,
          address
    })
}
