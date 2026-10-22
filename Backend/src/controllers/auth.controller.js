import userModel from "../models/user.model.js";

export const register = async (req, res) => {
  const { email, password, contact, fullName, isSeller } = req.body;

  try {
    const isAlreadyExist = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (isAlreadyExist) {
      return res.status(400).json({
        message: "User this email or contact is already exist",
      });
    }

    const user = await userModel.create({
      email,
      contact,
      password,
      fullName,
      role: isSeller ? "seller" : "buyer",
    });
    
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
