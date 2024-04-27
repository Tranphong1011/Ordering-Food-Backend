import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";

const router = express.Router();

// set up the Multer middleware.
const storage = multer.memoryStorage(); // creates in-memory storage for the uploaded files.
const upload = multer({ // initializes Multer
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb
  },
});
const myUploadMiddleware = upload.single("imageFile"); //  only one file will be uploaded with the field name "imageFile"

router.post("/", myUploadMiddleware, MyRestaurantController.createMyRestaurant);

export default router;
