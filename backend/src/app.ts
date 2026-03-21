import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import todosRouter from './routes/todos';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
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
