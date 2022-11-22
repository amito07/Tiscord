import asyncHandler from "express-async-handler";
import generateToken from "../db/generateToken.js";
import User from "../models/UserModel.js";

export const Login = (req, res, next) => {
  const { email, password } = req.body;
  res.send({ message: { email: email, password: password } });
};

export const Signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;

  try {
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please enter all required fields");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User Already exists");
    }

    const user = User.create({
      name,
      email,
      password,
      pic,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id, name, email),
      });
    } else {
      res.status(500);
      throw new Error("Something went wrong");
    }
  } catch (error) {
    res.status(500);
    throw error;
  }
});
