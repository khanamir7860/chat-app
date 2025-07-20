import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { getMessages, getUsersForSidebar, sendMessage } from '../controllers/messageController';
const messageRouter = express.Router();


messageRouter.get("/users",protectRoute,getUsersForSidebar);
messageRouter.get("/:id",protectRoute,getMessages);
messageRouter.put("/mark/:id",protectRoute,getMessages);
messageRouter.post("/send/:id",protectRoute,sendMessage);


export default messageRouter;