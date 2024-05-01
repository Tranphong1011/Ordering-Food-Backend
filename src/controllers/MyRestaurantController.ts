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
    const image = req.file as Express.Multer.File; //extracts the uploaded file from the request, req.file to the type Express.Multer.File
    const b64 = Buffer.from(image.buffer).toString("base64");
    const dataURI = "data:" + image.mimetype + ";base64," + b64;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    const restaurant = new Restaurant(req.body);

    restaurant.imageUrl = uploadResponse.url;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();

    await restaurant.save();

    res.status(201).send(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const fetchRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants.map((restaurant) => restaurant.toObject()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export default { createMyRestaurant, fetchRestaurants };
