import { Router } from "express";
import { Login, Signup } from "../../controllers/UserController.js";

const Userrouter = new Router();

Userrouter.post("/login", Login);
Userrouter.post("/signup", Signup);

export default Userrouter;
