import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
  const { title, description, priceAmount, priceCurrency } = req.body;
  const seller = req.user;

  const images = await Promise.all(
    req.files.map(async (file) => {
      const result = await uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
      });
      return result;
    }),
  );

  const product = await productModel.create({
    title,
    description,
    images,
    price: {
      amount: priceAmount,
      currency: priceCurrency || "INR",
    },
    seller: seller.id,
  });

  res.status(201).json({
    message: "Product created successfully",
    success: true,
    product,
  });
}

export async function getSellerProduct(req, res) {
  const seller = req.user;

  const products = await productModel.find({ seller: seller.id });

  res.status(200).json({
    message: "Product fetched successfully",
    success: true,
    products,
  });
}
