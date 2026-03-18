import {Router} from 'express'
import {sendMessage,getAllChats,getAllMessage,deleteChat} from '../controllers/chats.controller.js'
import {authMiddleware} from '../middleware/auth.middleware.js'
const chatRouter  = Router()


chatRouter.post('/message', authMiddleware, sendMessage)
chatRouter.get('/',authMiddleware,getAllChats)
chatRouter.get('/:chatId/messages',authMiddleware,getAllMessage)
chatRouter.delete('/:chatId',authMiddleware,deleteChat)
export default chatRouter