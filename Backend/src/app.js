import express from 'express';
import cookieParser from 'cookie-parser';
import AuthRouter from '../src/routes/auth.routes.js'
import chatRouter from '../src/routes/chats.routes.js'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"))

// ✅ CORS — localhost + Render dono
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://querynest-gh05.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}))

// ✅ Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ✅ API Routes — pehle
app.use('/api/auth', AuthRouter)
app.use('/api/chats', chatRouter)
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API is working', status: 'success' });
});

// ✅ Static files
app.use(express.static(path.join(__dirname, '../public')))

  
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: 'error'
  });
});

export default app;