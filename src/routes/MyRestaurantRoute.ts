import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

// set up the Multer middleware.
const storage = multer.memoryStorage(); // creates in-memory storage for the uploaded files.
const upload = multer({
  // initializes Multer
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb
  },
});
const myUploadMiddleware = upload.single("imageFile"); //  only one file will be uploaded with the field name "imageFile"

router.post(
  "/",
  myUploadMiddleware,
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  MyRestaurantController.createMyRestaurant
);
router.get("/restaurantList", MyRestaurantController.getAllRestaurants);

router.get("/", jwtCheck, jwtParse, MyRestaurantController.getCurrentRestaurant);

router.put("/", myUploadMiddleware, validateMyRestaurantRequest, jwtCheck, jwtParse, MyRestaurantController.updateMyRestaurant);


export default router;
