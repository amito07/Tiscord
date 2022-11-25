import { Router } from "express";
import { accessChat, fetchChats, createGroupChat, renameGroup, addGroupChat, deleteUserFromGroupChat } from "../../controllers/ChatController.js";
import middleware from "../../middleware/authUser.js";

const Chat = new Router();

Chat.post("/", middleware, accessChat);
Chat.get("/", middleware, fetchChats);
Chat.post('/group',middleware,createGroupChat)
Chat.post('/rename',middleware,renameGroup)
Chat.put('/groupAdd',middleware,addGroupChat)
Chat.put('/groupremove',middleware,deleteUserFromGroupChat)

export default Chat;
