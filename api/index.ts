// api/index.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../app'; // তোমার Express app

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Express app কে serverless ফাংশন হিসেবে handle করতে হবে
  app(req as any, res as any);
}