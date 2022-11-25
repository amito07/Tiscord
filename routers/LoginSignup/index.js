import { Router } from "express";
import { Login, Signup, AllUsers } from "../../controllers/Authorization.js";

const AuthorizationRoute = new Router();

AuthorizationRoute.get('/',AllUsers);
AuthorizationRoute.post("/login", Login);
AuthorizationRoute.post("/signup", Signup);

export default AuthorizationRoute;
