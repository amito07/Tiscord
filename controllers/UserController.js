import asyncHandler from "express-async-handler";
import generateToken from "../db/generateToken.js";
import User from "../models/UserModel.js";

export const Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    const userInfo = await User.findOne({ email });
    if (!userInfo) {
      return res.status(404).json({
        message: "User not found",
      });
    }else if(userInfo && (await User.matchPassword(password))){
      return res.status(200).json({
        message:"User Login Successfully"
      })
    }
    
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
    
  }

});

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

    const user = await User.create({
      name,
      email,
      password,
      pic,
    });
    console.log("user", user);

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
