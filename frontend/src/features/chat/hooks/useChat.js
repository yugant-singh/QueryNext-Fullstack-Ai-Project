import { useDispatch } from 'react-redux'
import {
  setChats, addChat, setActiveChat,
  setMessages, addMessage, setLoading, setError, clearMessages,removeChat
} from '../chat.slice'
import { getAllChats, getAllMessage, sendMessage,deleteChat } from '../services/chat.api'
import { initializeSocket } from '../services/chat.socket'

export const useChat = () => {
  const dispatch = useDispatch()
  const socket = initializeSocket()

  async function handleGetAllChats() {
    try {
      dispatch(setLoading(true))
      const data = await getAllChats()
      dispatch(setChats(data.chats))
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to fetch chats'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleGetChatMessages(chatId) {
    try {
      dispatch(setLoading(true))
      dispatch(setActiveChat(chatId))
      const data = await getAllMessage(chatId)
      dispatch(setMessages(data.messages))
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to fetch messages'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleSendMessage({ message, chatId }) {
    try {
      // Turant user message dikhao
      dispatch(addMessage({ role: 'user', content: message }))
      dispatch(setLoading(true))

      const data = await sendMessage({ message, chatId })

      // Nayi chat bani toh sidebar update karo
      if (data.chat) {
        dispatch(addChat(data.chat))
        dispatch(setActiveChat(data.chat._id))
        await handleGetAllChats()
      }

      // AI response turant dikhao
      dispatch(addMessage({
        role: 'ai',
        content: data.aiMessages.content
      }))

    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to send message'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleNewChat() {
    dispatch(clearMessages())
  }

  async function handleDeleteChat(chatId) {
  try {
    await deleteChat(chatId)
    dispatch(removeChat(chatId))
    dispatch(clearMessages())
  } catch (err) {
    dispatch(setError('Failed to delete chat'))
  }
}

  return { handleGetAllChats, handleGetChatMessages, handleSendMessage, handleNewChat, socket,handleDeleteChat }
}