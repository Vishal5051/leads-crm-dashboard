import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';
import { errorHandler } from './middleware/errorHandler';

// Load environmental parameters
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middlewares
app.use(cors({
  origin: '*', // Dynamic CORS support
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Healthcheck API
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Smart Leads Dashboard API Service',
    data: {
      status: 'Online',
      timestamp: new Date().toISOString(),
    }
  });
});

// Routing endpoints
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Catch-all invalid route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint matching ${req.method} '${req.path}' is not registered on this server.`,
  });
});

// Error handling middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server successfully started in '${process.env.NODE_ENV || 'development'}' mode on port ${PORT}`);
});

export default app;
