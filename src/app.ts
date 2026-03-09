// src/app.ts
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';

const app: Application = express();

// CORS configuration - important for production
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true
}));

app.use(cookieParser());

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send({
    Message: "Masud Memorial Collage Server is running..."
  });
});

// Health check for Vercel
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/v1', router);

// Global error handler
app.use(globalErrorHandler);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!"
    }
  });
});

export default app;