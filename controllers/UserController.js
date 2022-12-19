import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";

export const AllUsers = asyncHandler(async (req, res, next) => {
  const userInfo = req.user;
  const searchValue = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(searchValue).find({_id: {$ne: userInfo.id}});
  console.log(users);
  res.send({searchUser:userInfo,requesteduser:users});
});
