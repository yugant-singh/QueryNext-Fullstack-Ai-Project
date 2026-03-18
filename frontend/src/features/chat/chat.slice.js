import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: [],
        messages: [],
        activeChat: null,
        loading: false,
        error: null
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload
        },
        addChat: (state, action) => {
            state.chats.unshift(action.payload)
        },
        setActiveChat: (state, action) => {
            state.activeChat = action.payload
        },
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload)
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        clearMessages: (state) => {
            state.messages = []
            state.activeChat = null
        },
        removeChat: (state, action) => {
            state.chats = state.chats.filter(chat => chat._id !== action.payload)
        }
    }
})


export const {
    setChats, addChat, setActiveChat,
    setMessages, addMessage, setLoading, setError, clearMessages,removeChat
} = chatSlice.actions

export default chatSlice.reducer