
import { body, validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({
      errors: error.array(),
    });
  }

  return next(); // This was missing!
};

export const productValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("priceAmount").notEmpty().withMessage("Price amount is required"),
  body("priceCurrency").notEmpty().withMessage("Price currency is required"),
  validateRequest,
];
