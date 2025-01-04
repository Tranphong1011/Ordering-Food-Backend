import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  
  next();
};
export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name must be string"),
  body("city").isString().notEmpty().withMessage("City must be string"),
  body("country").isString().notEmpty().withMessage("Country must be string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("AddressLine1 must be string"),
  handleValidationErrors,
];

export const validateMyRestaurantRequest = [
  body("restaurantName")
    .isString()
    .notEmpty()
    .withMessage("Restaurant name must be string"),
  body("city").isString().notEmpty().withMessage("City must be string"),
  body("country").isString().notEmpty().withMessage("Country must be string"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("Delivery price must be a positive number"),
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage("Estimated Delivery Time must be a positive number"),
  body("cuisines")
    .isArray()
    .withMessage("Cuisine must be an array")
    .notEmpty()
    .withMessage("Cuisines array cannot be empty"),
  body("menuItems").isArray().withMessage("Menu Items must be an array"),
  body("menuItems.*.name")
    .isString()
    .notEmpty()
    .withMessage("Menu Item name are required"),
  body("menuItems.*.price")
    .isFloat({ min: 0 })
    .withMessage("Menu Item Price must be a positive number and is required"),
  handleValidationErrors,
];
