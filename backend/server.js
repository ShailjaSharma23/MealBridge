import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Initialize database connection
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to MealBridge API Server',
    description: 'Real-Time Food Rescue & Shelter Distribution Platform',
    documentation: '/api/health',
    status: 'online',
  });
});

// API Routes
app.use('/api', healthRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] MealBridge API Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  console.log(`[Server] Health check endpoint ready at http://localhost:${PORT}/api/health`);
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('\n[Server] Gracefully shutting down MealBridge API...');
  server.close(() => {
    console.log('[Server] Server closed successfully.');
    process.exit(0);
  });
});

export default app;
