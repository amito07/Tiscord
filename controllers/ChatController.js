import asyncHandler from "express-async-handler";
import Chat from "../models/ChatModel.js";
import User from "../models/UserModel.js";

export const accessChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email pic",
  });

  if (isChat.length > 0) {
    res.status(200).send(isChat[0]);
  } else {
    var chatData = {
      chatName: "Sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createChat = await Chat.create(chatData);

      const FullChat = await Chat.find({ _id: createChat._id }).populate(
        "users",
        "-password"
      );

      res.status(201).send(FullChat);
    } catch (error) {
      res.status(400);
      throw error;
    }
  }
});

export const fetchChats = asyncHandler(async (req, res, next) => {
  try {
    var fetchChats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin")
      .sort({ updatedAt: -1 });
    if (fetchChats) {
      fetchChats = await User.populate(fetchChats, {
        path: "latestMessage.sender",
        select: "name email pic",
      });
      res.status(200).send(fetchChats);
    }
  } catch (error) {
    res.status(400);
    throw error;
  }
});

export const createGroupChat = asyncHandler(async (req, res, next) => {
  if (!req.body.name || !req.body.users) {
    return res
      .status(404)
      .send({ message: "Please Fill all the required fields." });
  }

  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(404)
      .send({ message: "More than 2 users are required to form a group" });
  }

  users.push(req.user);

  try {
    var groupInfo = {
      chatName: req.body.name,
      users,
      isGroupChat: true,
      groupAdmin: req.user,
    };

    const createGroupChat = await Chat.create(groupInfo);

    if (createGroupChat) {
      const fullGroupChat = await Chat.find({ _id: createGroupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.status(200).send(fullGroupChat);
    }
  } catch (error) {
    res.status(400);
    throw error;
  }
});

export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      return res.status(400).send({ message: "No Chat Found" });
    }
    res.status(200).send(updatedChat);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

export const addGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!added) {
      return res.status(400).send({ message: "User not found" });
    }
    res.status(200).send(added);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

export const deleteUserFromGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const removeUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removeUser) {
      return res.status(400).send({ message: "Something went wrong" });
    }
    res.status(200).send(removeUser);
  } catch (error) {
    res.status(400);
    throw error;
  }
});
