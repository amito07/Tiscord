import express from "express";
import dotenv from "dotenv";
import AuthorizationRoute from "./routers/LoginSignup/index.js";
import UserRoute from "./routers/User/index.js";
import connectDB from "./db/config.js";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.use(express.json());
app.use("/api/v1", UserRoute);
app.use("/api/v1/users", AuthorizationRoute);

app.listen(process.env.PORT, () => {
  console.log("Server is Running");
});
