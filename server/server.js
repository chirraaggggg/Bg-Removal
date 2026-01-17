import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './configs/mongodb.js';
import userRouter from './routes/userRoutes.js';

// App config
const PORT = process.env.PORT || 4000;
const app = express();

// Initialize middleware
// Note: Webhook endpoints need raw body for signature verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(cors()); 

// Connect to database (with error handling)
connectDB().catch(err => {
  console.error('Database connection failed:', err);
});

// API routes
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: "API is working",
    timestamp: new Date().toISOString()
  });
});
app.use('/api/user',userRouter)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: "Server is healthy",
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route not found" 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: err.message || "Internal Server Error" 
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log("Server is running on port "+ PORT));
}

// Export for Vercel
export default app;