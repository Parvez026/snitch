import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  next();
}

export const validateRegisterUser = [
  body("email").isEmail("").withMessage("Invalid email formate"),
  body("contact")
    .notEmpty()
    .withMessage("contact is required")
    .matches(/^\d{10}$/)
    .withMessage("Contact must be a 10-digit number"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),
  body("isSeller")
     .isBoolean()
     .withMessage("isSeller must be a boolean value"),

  validateRequest,
];

export const validateLoginUser = [
  body("email").isEmail().withMessage("Invalid email formate"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character long"),

    validateRequest
];
