import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connect to DB successfully"));
const app = express();
app.use(express.json());
app.use(cors());

app.get("/test", async (req: Request, res: Response) => {
  res.json({ message: "Hello!" });
});
app.get("/", async (req: Request, res: Response) => {
  res.send("Welcome to the Express server!");
});


app.use("/api/my/user", myUserRoute);


app.listen(7000, () => {
  console.log("Server listening on port 7000");
});
