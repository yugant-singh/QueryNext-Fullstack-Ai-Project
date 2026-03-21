import React from 'react'
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../../auth/hooks/useAuth'

const Logo = () => (
  <div className="flex items-center gap-2 px-3 py-4 mb-2">
    <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30"
      style={{ background: "linear-gradient(135deg, #6C63FF, #3B82F6)" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
        <path d="M16.5 16.5L21 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 11h6M11 8v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
    <span className="text-xl font-extrabold tracking-tight"
      style={{ fontFamily: "'Syne', sans-serif", background: "linear-gradient(135deg, #fff 40%, #6C63FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
      QueryNext
    </span>
  </div>
);

const markdownComponents = {
  img: ({ src, alt }) => {
    if (!src) return null
    return <img src={src} alt={alt || "generated image"} style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 12, marginTop: 8 }} />
  },
  h1: ({ children }) => <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9", marginTop: 12, marginBottom: 6 }}>{children}</h1>,
  h2: ({ children }) => <h2 style={{ fontSize: 17, fontWeight: 600, color: "#F1F5F9", marginTop: 10, marginBottom: 4 }}>{children}</h2>,
  h3: ({ children }) => <h3 style={{ fontSize: 15, fontWeight: 600, color: "#CBD5E1", marginTop: 8, marginBottom: 4 }}>{children}</h3>,
  p: ({ children }) => <p style={{ marginBottom: 8, lineHeight: 1.7 }}>{children}</p>,
  ul: ({ children }) => <ul style={{ paddingLeft: 20, marginBottom: 8 }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ paddingLeft: 20, marginBottom: 8 }}>{children}</ol>,
  li: ({ children }) => <li style={{ marginBottom: 4, listStyleType: "disc" }}>{children}</li>,
  strong: ({ children }) => <strong style={{ color: "#a5a0ff", fontWeight: 600 }}>{children}</strong>,
  em: ({ children }) => <em style={{ color: "#94A3B8" }}>{children}</em>,
  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#a5a0ff", textDecoration: "underline" }}>{children}</a>,
  code: ({ children }) => <code style={{ background: "rgba(108,99,255,0.15)", padding: "2px 6px", borderRadius: 4, fontSize: 12, color: "#a5a0ff" }}>{children}</code>,
  pre: ({ children }) => <pre style={{ background: "rgba(0,0,0,0.3)", padding: "12px 16px", borderRadius: 8, overflowX: "auto", fontSize: 12, marginTop: 8, marginBottom: 8 }}>{children}</pre>
}

export default function Dashboard() {
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredChat, setHoveredChat] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const sidebarRef = useRef(null)

  const { handleGetAllChats, handleGetChatMessages, handleSendMessage, handleNewChat, handleDeleteChat, handleUploadFile } = useChat()
  const { handleLogOut } = useAuth()

  const chats = useSelector(state => state.chat.chats) || []
  const messages = useSelector(state => state.chat.messages) || []
  const loading = useSelector(state => state.chat.loading)
  const activeChat = useSelector(state => state.chat.activeChat)
  const fileText = useSelector(state => state.chat.fileText)
  const user = useSelector(state => state.auth.user)

  useEffect(() => { handleGetAllChats() }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSend = () => {
    if (!input.trim() && !fileText) return
    const messageToSend = input.trim() || (fileText?.startsWith('__IMAGE_URL__:') ? "Analyze this image" : "")
    if (!messageToSend) return
    handleSendMessage({ message: messageToSend, chatId: activeChat, fileText })
    setInput('')
    setSelectedFile(null)
    setImagePreview(null)
  }

  const handleChatSelect = (id) => {
    handleGetChatMessages(id)
    setSidebarOpen(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(108,99,255,0.3); border-radius: 10px; }
        textarea { caret-color: #6C63FF; }
        textarea:focus { outline: none; }
        .touch-btn {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          cursor: pointer;
          user-select: none;
        }
      `}</style>

      <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#080810" }}>

        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-20 -left-10 w-72 h-72 md:w-96 md:h-96 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #6C63FF, transparent 70%)", filter: "blur(50px)" }} />
          <div className="absolute top-10 right-10 w-60 h-60 md:w-80 md:h-80 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #3B82F6, transparent 70%)", filter: "blur(50px)" }} />
          <div className="absolute bottom-10 left-1/3 w-72 h-72 md:w-96 md:h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)", filter: "blur(60px)" }} />
        </div>

        {/* Mobile Overlay — sirf bahar click pe band karo */}
        {sidebarOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full md:hidden"
            style={{ zIndex: 20, background: "rgba(0,0,0,0.6)" }}
            onTouchStart={(e) => {
              // Sirf sidebar ke bahar touch karne pe band karo
              if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setSidebarOpen(false)
              }
            }}
            onClick={(e) => {
              if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setSidebarOpen(false)
              }
            }}
          />
        )}

        <div className="relative z-10 flex h-full w-full p-2 md:p-4 gap-3">

          {/* Sidebar */}
          <div
            ref={sidebarRef}
            className={`fixed md:relative top-0 left-0 h-full w-72 md:w-64 flex-shrink-0 flex flex-col rounded-none md:rounded-2xl p-3 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            style={{
              background: "rgba(15,15,30,0.97)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              zIndex: 40, // ← overlay se upar
            }}
          >
            {/* Mobile close button */}
            <button
              className="touch-btn md:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: "rgba(255,255,255,0.07)", color: "#94A3B8", border: "none" }}
              onClick={() => setSidebarOpen(false)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <Logo />

            {/* New Chat Button */}
            <button
              className="touch-btn flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium mb-4 transition-all duration-200 hover:opacity-80"
              style={{ background: "rgba(108,99,255,0.15)", border: "1px solid rgba(108,99,255,0.25)", color: "#a5a0ff" }}
              onClick={() => { handleNewChat(); setSidebarOpen(false) }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              New Chat
            </button>

            <p className="text-xs font-semibold uppercase tracking-widest px-2 mb-2" style={{ color: "#475569" }}>Recent</p>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-1">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  className="relative flex items-center rounded-xl transition-all duration-200"
                  style={{
                    background: activeChat === chat._id ? "rgba(108,99,255,0.12)" : hoveredChat === chat._id ? "rgba(255,255,255,0.04)" : "transparent",
                    border: `1px solid ${activeChat === chat._id ? "rgba(108,99,255,0.3)" : "transparent"}`,
                  }}
                  onMouseEnter={() => setHoveredChat(chat._id)}
                  onMouseLeave={() => setHoveredChat(null)}
                >
                  <button
                    className="touch-btn flex-1 text-left px-3 py-2.5 text-sm truncate"
                    style={{
                      color: activeChat === chat._id ? "#a5a0ff" : "#94A3B8",
                      background: "transparent",
                      border: "none",
                      paddingRight: "2.5rem",
                    }}
                    onClick={() => handleChatSelect(chat._id)}
                  >
                    {chat.title}
                  </button>

                  <button
                    className="touch-btn absolute right-2 w-6 h-6 flex items-center justify-center rounded-md transition-all"
                    style={{
                      color: "#EF4444",
                      border: "none",
                      background: "rgba(239,68,68,0.1)",
                      opacity: hoveredChat === chat._id ? 1 : 0.3,
                    }}
                    onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat._id) }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* User Account Dropdown */}
            <div className="mt-3 relative" ref={dropdownRef}>
              {dropdownOpen && (
                <div
                  className="absolute bottom-full left-0 right-0 mb-2 rounded-xl overflow-hidden"
                  style={{ background: "rgba(15,15,35,0.98)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", zIndex: 50 }}
                >
                  <button
                    className="touch-btn w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:opacity-80"
                    style={{ background: "transparent", border: "none", color: "#94A3B8" }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Profile
                  </button>

                  <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

                  <button
                    className="touch-btn w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:opacity-80"
                    style={{ background: "transparent", border: "none", color: "#EF4444" }}
                    onClick={() => { handleLogOut(); setDropdownOpen(false); setSidebarOpen(false) }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}

              {/* User Card */}
              <button
                className="touch-btn w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #6C63FF, #3B82F6)" }}>
                  {user?.username?.[0]?.toUpperCase() || "Y"}
                </div>
                <div className="overflow-hidden flex-1 text-left">
                  <p className="text-sm font-medium text-slate-200 truncate">{user?.username || "User"}</p>
                  <p className="text-xs" style={{ color: "#475569" }}>Free Plan</p>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  style={{ color: "#475569", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                  <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col rounded-2xl overflow-hidden min-w-0"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>

            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 md:px-5 py-3.5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-3">
                <button
                  className="touch-btn md:hidden w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#94A3B8", border: "none" }}
                  onClick={() => setSidebarOpen(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <p className="text-sm font-semibold truncate max-w-[160px] md:max-w-xs"
                  style={{ color: "#6C63FF", fontFamily: "'Syne', sans-serif" }}>
                  {chats.find((c) => c._id === activeChat)?.title || "QueryNext"}
                </p>
              </div>
              <div className="flex gap-2">
                {["Copy", "Share"].map((btn) => (
                  <button key={btn} className="px-2.5 md:px-3 py-1 rounded-lg text-xs transition-all duration-200 hover:opacity-70"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }}>
                    {btn}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5 flex flex-col gap-4">
              {messages.length === 0 && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: "linear-gradient(135deg, #6C63FF, #3B82F6)" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
                      <path d="M16.5 16.5L21 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-slate-300 font-medium text-lg mb-1">Ask me anything</p>
                  <p className="text-slate-600 text-sm">Start a conversation with QueryNext</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" && (
                    <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mr-2 mt-1"
                      style={{ background: "linear-gradient(135deg, #6C63FF, #3B82F6)" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
                        <path d="M16.5 16.5L21 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                  <div className="max-w-[85%] md:max-w-3xl px-4 py-3 text-sm leading-relaxed text-slate-200"
                    style={{
                      borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                      background: msg.role === "user" ? "linear-gradient(135deg, rgba(108,99,255,0.28), rgba(59,130,246,0.18))" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${msg.role === "user" ? "rgba(108,99,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                      fontWeight: 300,
                    }}>
                    {msg.role === 'ai' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {msg.content}
                      </ReactMarkdown>
                    ) : msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mr-2 mt-1"
                    style={{ background: "linear-gradient(135deg, #6C63FF, #3B82F6)" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
                      <path d="M16.5 16.5L21 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="px-4 py-3 rounded-2xl text-sm text-slate-400 animate-pulse"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="px-3 md:px-5 py-3 md:py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>

              {imagePreview && (
                <div className="mb-2 px-1 flex items-center gap-2">
                  <img src={imagePreview} alt="preview" style={{ height: 60, borderRadius: 8, objectFit: "cover" }} />
                  <div>
                    <p className="text-xs" style={{ color: "#a5a0ff" }}>📎 {selectedFile}</p>
                    <p className="text-xs" style={{ color: "#475569" }}>Send File</p>
                  </div>
                  <button onClick={() => { setImagePreview(null); setSelectedFile(null) }}
                    className="ml-auto w-5 h-5 flex items-center justify-center rounded-full"
                    style={{ background: "rgba(239,68,68,0.2)", color: "#EF4444", border: "none" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              )}

              {selectedFile && !imagePreview && (
                <div className="mb-2 px-1 flex items-center gap-2">
                  <p className="text-xs" style={{ color: "#a5a0ff" }}>📄 {selectedFile} loaded</p>
                  <button onClick={() => setSelectedFile(null)}
                    className="ml-auto w-5 h-5 flex items-center justify-center rounded-full"
                    style={{ background: "rgba(239,68,68,0.2)", color: "#EF4444", border: "none" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", backdropFilter: "blur(10px)" }}>

                <input type="file" accept=".pdf,.txt,.docx,.jpg,.jpeg,.png" id="file-upload" className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files[0]
                    if (!file) return
                    setSelectedFile(file.name)
                    if (file.type.startsWith('image/')) setImagePreview(URL.createObjectURL(file))
                    await handleUploadFile(file)
                  }}
                />
                <label htmlFor="file-upload"
                  className="touch-btn cursor-pointer flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:opacity-80"
                  style={{ background: fileText ? "rgba(108,99,255,0.3)" : "rgba(108,99,255,0.15)", color: "#a5a0ff" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </label>

                <textarea rows={1} value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder={fileText ? "Ask anything about the file..." : "Ask QueryNext anything..."}
                  className="flex-1 bg-transparent border-none resize-none text-sm text-slate-200 placeholder-slate-500"
                  style={{ maxHeight: 120, overflowY: "auto", fontFamily: "'DM Sans', sans-serif" }}
                />

                <button onClick={handleSend} disabled={loading}
                  className="touch-btn w-8 h-8 md:w-9 md:h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-150 hover:opacity-80 active:scale-95 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #6C63FF, #8B5CF6)", boxShadow: "0 0 16px rgba(108,99,255,0.4)", border: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p className="text-center text-xs mt-2" style={{ color: "#334155" }}>
                QueryNext can make mistakes. Verify important info.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
