import {Router} from 'express'
import {sendMessage,getAllChats,getAllMessage} from '../controllers/chats.controller.js'
import {authMiddleware} from '../middleware/auth.middleware.js'
const chatRouter  = Router()


chatRouter.post('/message', authMiddleware, sendMessage)
chatRouter.get('/',authMiddleware,getAllChats)
chatRouter.get('/:chatId/messages',authMiddleware,getAllMessage)

export default chatRouter