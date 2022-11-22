import express from "express";
import dotenv from "dotenv";
import Userrouter from "./routers/LoginSignup/index.js";
import connectDB from "./db/config.js";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.use(express.json());
app.use("/api/v1/users", Userrouter);

app.listen(process.env.PORT, () => {
  console.log("Server is Running");
});
