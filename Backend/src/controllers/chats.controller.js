import { generateResponse,generateMistralTitle } from '../services/ai.service.js';
import chatModel from '../models/chat.model.js'
import messageModel from '../models/message.model.js'

export async function sendMessage(req, res) {
  try {
    const { message ,chat:chatId } = req.body;

  let chat=null,title=null
  if(!chatId){
  title  = await generateMistralTitle(message)
   chat  = await chatModel.create({
    user:req.user.id,
    title:title
  })

  }

 
  const userMessage = await messageModel.create({
    chat: chatId || chat._id,
    content:message,
    role:"user"
  })

  const messages = await messageModel.find({chat:chatId})
  const response  = await generateResponse(messages)

 
  const aiMessages = await messageModel.create({
    chat: chatId ||chat._id,
    content:response,
    role:"ai"
  })

  res.json({ 
    title,
    chat,
    aiMessages
   });

   
  } catch (err) {
   
    res.status(500).json({ error: 'Failed to process message' });
  }
}

export  async function getAllChats(req,res){
  try{
    const user  = req.user
    const chats  = await chatModel.find({user:user.id})
    res.status(200).json({
      message:"Chats Recieved Successfully",
      chats
    })
  }
  catch(err){
    return res.status(500).json({
     error: 'Failed to process message' 
    })
  }
}

export async function getAllMessage(req,res){
  try{
    const {chatId} = req.params
    const chat = await chatModel.findOne({
      _id:chatId,
      user:req.user.id
    })
    if(!chat){
      return res.status(404).json({
        message:"chat not found"
      })
    }

    const messages = await messageModel.find({
      chat:chatId
    })

    res.status(200).json({
      message:"all message fetched successfuly",
      messages
    })
  }
   catch(err){
    return res.status(500).json({
     error: 'Failed to process message' 
    })
  }
  
}
