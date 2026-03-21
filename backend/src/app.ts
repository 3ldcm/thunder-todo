import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { getTodos, createTodo, updateTodo, deleteTodo } from './store';
import { Todo } from './types';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// GET /todos - list all (optional ?status=active|completed)
app.get('/todos', (req: Request, res: Response) => {
  const status = req.query['status'] as string | undefined;
  let filter: 'all' | 'active' | 'completed' | undefined;
  if (status === 'active' || status === 'completed') {
    filter = status;
  }
  const result = getTodos(filter);
  res.json(result);
});

// POST /todos - create
app.post('/todos', (req: Request, res: Response) => {
  const { title } = req.body as { title?: string };
  if (!title || !title.trim()) {
    res.status(400).json({ error: 'title is required' });
    return;
  }
  const todo = createTodo(title.trim());
  res.status(201).json(todo);
});

// PATCH /todos/:id - update (mark complete/incomplete)
app.patch('/todos/:id', (req: Request, res: Response) => {
  const id = req.params['id'] as string;
  const { completed } = req.body as { completed?: boolean };
  if (typeof completed !== 'boolean') {
    res.status(400).json({ error: 'completed is required' });
    return;
  }
  const todo = updateTodo(id, completed);
  if (!todo) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(todo);
});

// DELETE /todos/:id - delete
app.delete('/todos/:id', (req: Request, res: Response) => {
  const id = req.params['id'] as string;
  const deleted = deleteTodo(id);
  if (!deleted) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.status(204).send();
});

// Serve frontend static files if built (Docker production)
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// Fallback: serve frontend for non-API routes
const indexFile = path.join(publicDir, 'index.html');
if (fs.existsSync(indexFile)) {
  app.get('*', (_req: Request, res: Response) => res.sendFile(indexFile as string));
}

export default app;
