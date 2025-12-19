import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { getAllUserChats, getChat, sendChatMessage } from '../controllers/ChatController.js'

const chatRouter = express.Router()

chatRouter.post('/',protect,getChat)
chatRouter.post('/user',protect,getAllUserChats)
chatRouter.post('/send-message',protect,sendChatMessage)






export default chatRouter