import asyncHandler from "express-async-handler";
import generateToken from "../db/generateToken.js";
import User from "../models/UserModel.js";
import bcrypt from 'bcryptjs';

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
    }else if(userInfo){
      const compare = await bcrypt.compare(password,userInfo.password)
      if(compare){
        const data = {
          name: userInfo.name,
          email: userInfo.email,
          token: generateToken(userInfo._id, userInfo.name, userInfo.email)
        }
        return res.status(200).json({
          message:"User Login Successfully",
          data
        })
      }else{
        return res.status(400).json({
          message:"Email or password do not match",
        })
      }
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

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email,
      password:hash,
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

export const AllUsers = asyncHandler(async(req,res,next)=>{
  res.send("Hello")
})
