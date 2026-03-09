// src/api/index.ts (or create at: api/index.ts)
import app from '../app';
import serverless from 'serverless-http';

// Export the serverless handler
export const handler = serverless(app);

// Optional: Add a health check endpoint specifically for Vercel
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});