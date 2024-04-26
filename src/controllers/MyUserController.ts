import { Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const _id = req.userId;
    const currentUser = await User.findOne({ _id });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(currentUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const createCurrentUser = async (req: Request, res: Response) => {
  // 1. Check if current user exists

  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      return res.status(200).send();
    }
    // 2. Create the current user if it doesn't already exist
    const newUser = new User(req.body);
    await newUser.save();

    // 3. Return the current user to the calling client
    res.status(201).json(newUser.toObject());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
};

const fetchUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users.map((user) => user.toObject()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
};
export default {
  createCurrentUser,
  fetchUser,
  updateCurrentUser,
  getCurrentUser,
};
