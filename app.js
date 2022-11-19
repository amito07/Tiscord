import express from "express";
import dotenv from "dotenv";
import Userrouter from "./routers/Login_Signup/index.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use("/api/v1/users", Userrouter);

app.listen(process.env.PORT, () => {
  console.log("Server is Running");
});
