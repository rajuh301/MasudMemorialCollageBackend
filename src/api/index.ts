import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../app'; // তোমার Express app

export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req, res); // Express app কে Serverless function হিসেবে ব্যবহার করা
}