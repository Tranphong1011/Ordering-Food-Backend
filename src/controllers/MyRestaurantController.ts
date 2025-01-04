import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });
    if (existingRestaurant) {
      return res.status(409).json({ message: "Restaurant already exists" });
    }
    const restaurant = new Restaurant(req.body);
    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.imageUrl = imageUrl;
    restaurant.lastUpdated = new Date();

    await restaurant.save();
    res.status(201).send(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find();
    res
      .status(200)
      .json(restaurants.map((restaurant) => restaurant.toObject()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const getCurrentRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant.toObject());

  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching restaurant" });
  }
};

const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    // const restaurant = await Restaurant.findOne({ user: req.userId });
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    console.log("req.body: ", req.body);
    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      restaurant.imageUrl = imageUrl;
    }

    console.log("restaurant: ", restaurant);

    await restaurant.save();
    res.status(200).send(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error updating restaurant" });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const b64 = Buffer.from(image.buffer).toString("base64");
  const dataURI = "data:" + image.mimetype + ";base64," + b64;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};
export default {
  createMyRestaurant,
  getAllRestaurants,
  getCurrentRestaurant,
  updateMyRestaurant,
};
