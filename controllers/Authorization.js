import asyncHandler from "express-async-handler";
import generateToken from "../db/generateToken.js";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { transporter } from "../utils/TransPorter.js";
import connectDB from "../db/config.js";

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
    } else if (userInfo) {
      const compare = await bcrypt.compare(password, userInfo.password);
      if (compare) {
        const data = {
          name: userInfo.name,
          email: userInfo.email,
          token: generateToken(userInfo._id, userInfo.name, userInfo.email),
        };
        return res.status(200).json({
          message: "User Login Successfully",
          data,
        });
      } else {
        return res.status(400).json({
          message: "Email or password do not match",
        });
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

  const session = await User.startSession();
  session.startTransaction();
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

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create([{ name, email, password: hash, pic }], {
      session,
    });

    res.status(201).json({
      _id: user[0]._id,
      name: user[0].name,
      email: user[0].email,
      pic: user[0].pic,
      token: generateToken(user[0]._id, name, email),
    });
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500);
    throw error;
  }
});

export const AllUsers = asyncHandler(async (req, res, next) => {
  console.log("GG");
  const mailData = {
    from: "lianbadhon@gmail.com",
    to: "lianamito45@gmail.com",
    subject: "Welcome Message",
    text: "Welcome to Tiscord ! Its Now or Never",
    html: `<b>Hey there! </b>
    <br> This is our first message sent with Nodemailer<br/>`,
  };

  transporter.sendMail(mailData, (err, info) => {
    if (err) {
      console.log("Error", err);
    }
    console.log(info);
  });
});
