<div align="center">

# 🔍 QueryNest
## Live_Demo - https://querynest-gh05.onrender.com/
### AI-Powered Search & Chat Platform



**QueryNest** is a full-stack AI-powered search and chat platform — similar to Perplexity AI. It lets users ask anything, get real-time web-sourced answers, generate images, upload files, and maintain persistent chat history — all in a sleek dark UI.


</div>

---

## 📸 Screenshots

> **Home Page**
![Home Page](./frontend/src/assets/QueryNext%20Homepage.png)

> _Dashboard, Login, and Register pages available on the live demo._

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **AI-Powered Search** | Real-time web search using Tavily API integrated with Groq LLM |
| 💬 **Persistent Chat** | Save, revisit, and delete conversations — stored in MongoDB |
| 🖼️ **Image Generation** | Generate images from text prompts using Pollinations AI |
| 📄 **File Upload** | Upload PDFs, images, and documents — ask AI about them |
| 🔐 **JWT Authentication** | Secure login/register with email verification |
| 📧 **Email Verification** | Transactional emails via Brevo API |
| ⚡ **Real-time Updates** | Socket.IO integration for live communication |
| 🗄️ **Redis Caching** | Token blacklisting on logout using Redis |
| 📱 **Fully Responsive** | Works seamlessly on desktop and mobile |
| 🌙 **Dark Cinematic UI** | Custom dark theme with purple/blue gradients |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI Framework |
| **Redux Toolkit** | Global state management |
| **React Router v7** | Client-side routing |
| **Tailwind CSS v4** | Utility-first styling |
| **Socket.IO Client** | Real-time communication |
| **Axios** | HTTP requests |
| **React Markdown** | Render AI responses in markdown |
| **Vite** | Build tool |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | REST API server |
| **MongoDB + Mongoose** | Database & ODM |
| **Redis** | Token blacklisting & caching |
| **Socket.IO** | WebSocket server |
| **JWT** | Authentication tokens |
| **Brevo API** | Transactional email service |
| **Groq SDK** | LLM inference (llama3, mixtral) |
| **Tavily API** | Real-time web search |
| **ImageKit** | Image upload & CDN |

---

## 🏗️ Project Structure

```
QueryNest/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database & Redis config
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Auth middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # AI, email, socket services
│   │   └── app.js           # Express app setup
│   └── server.js            # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Store, routes, global config
│   │   ├── features/
│   │   │   ├── auth/        # Login, Register, Protected routes
│   │   │   └── chat/        # Dashboard, Chat logic
│   │   └── main.jsx
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (Atlas or local)
- Redis instance (Upstash or local)
- API Keys: Groq, Tavily, Brevo, ImageKit

## 🔌 API Endpoints

### Auth Routes `/api/auth`
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/register` | Register new user | Public |
| `POST` | `/login` | Login user | Public |
| `GET` | `/verify-email` | Verify email token | Public |
| `GET` | `/get-me` | Get current user | Private |
| `GET` | `/logout` | Logout user | Private |

### Chat Routes `/api/chats`
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | Get all chats | Private |
| `POST` | `/` | Create new chat | Private |
| `GET` | `/:id/messages` | Get chat messages | Private |
| `POST` | `/:id/messages` | Send message | Private |
| `DELETE` | `/:id` | Delete chat | Private |

---

## 🌐 Deployment

This project is deployed on **Render** as a single full-stack service.

- Frontend is built with `npm run build` and served statically from `Backend/public/`
- Backend serves both the API and the React app
- React Router fallback handled via `app.get('/{*splat}', ...)` in Express

---

## 👨‍💻 Author

**Yugant Singh**


## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ by Yugant Singh</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>