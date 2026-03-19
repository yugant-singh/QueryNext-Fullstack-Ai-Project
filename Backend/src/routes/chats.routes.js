import {Router} from 'express'
import upload from '../middleware/upload.middleware.js'
import {sendMessage,getAllChats,getAllMessage,deleteChat,uploadFile} from '../controllers/chats.controller.js'

import {authMiddleware} from '../middleware/auth.middleware.js'
const chatRouter  = Router()


chatRouter.post('/message', authMiddleware, sendMessage)
chatRouter.get('/',authMiddleware,getAllChats)
chatRouter.get('/:chatId/messages',authMiddleware,getAllMessage)
chatRouter.delete('/:chatId',authMiddleware,deleteChat)
chatRouter.post('/upload', authMiddleware, upload.single('file'), uploadFile)
export default chatRouter