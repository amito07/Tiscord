import express from "express";
import dotenv from "dotenv";
import AuthorizationRoute from "./routers/LoginSignup/index.js";
import UserRoute from "./routers/User/index.js";
import ChatRoute from './routers/Chat/index.js'
import connectDB from "./db/config.js";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.use(express.json());
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/auth", AuthorizationRoute);
app.use("/api/v1/chat", ChatRoute);

app.listen(process.env.PORT, () => {
  console.log("Server is Running");
});
