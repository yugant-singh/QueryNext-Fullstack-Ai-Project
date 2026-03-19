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
// Load environment variables


// Create Express application
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"))
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
  methods:["GET","POST","PUT","DELETE"]
}))
app.use('/images', express.static(path.join(__dirname, '../public/images')))


// Basic Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', AuthRouter) 
app.use('/api/chats', chatRouter)

// Test Route
app.get('/api/test', (req, res) => {
  res.status(200).json({
    message: 'API is working',
    status: 'success'
  });
});

  


// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path
  });
});


// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: 'error'
  });
});


export default app;
