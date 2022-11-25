import { Router } from "express";
import { AllUsers } from "../../controllers/UserController.js";
import middleware from "../../middleware/authUser.js";

const User = new Router();

User.get("/", middleware, AllUsers);

export default User;
