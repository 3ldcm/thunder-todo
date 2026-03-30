import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import todosRouter from './routes/todos';

const app = express();

// Security headers
app.use(helmet());

// CORS — restrict to Tailscale network (update ORIGIN for your tailnet)
const allowedOrigins = process.env.ALLOWED_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body size limit — max 1KB per request
app.use(express.json({ limit: '1kb' }));

// Health check (no rate limit)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/todos', todosRouter);

// Serve frontend static files if built (Docker production)
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// Fallback: serve frontend for non-API routes
const indexFile = path.join(publicDir, 'index.html');
if (fs.existsSync(indexFile)) {
  app.get('*', (_req: Request, res: Response) => res.sendFile(indexFile as string));
}

export default app;
