import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// In-memory store
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

let todos: Todo[] = [];
let nextId = 1;

// GET /todos - list all (optional ?status=active|completed)
app.get('/todos', (req: Request, res: Response) => {
  const { status } = req.query;
  let result = todos;
  if (status === 'active') result = todos.filter((t) => !t.completed);
  else if (status === 'completed') result = todos.filter((t) => t.completed);
  res.json(result);
});

// POST /todos - create
app.post('/todos', (req: Request, res: Response) => {
  const { text } = req.body as { text?: string };
  if (!text || !text.trim()) {
    res.status(400).json({ error: 'text is required' });
    return;
  }
  const todo: Todo = {
    id: nextId++,
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  res.status(201).json(todo);
});

// PATCH /todos/:id - toggle complete
app.patch('/todos/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params['id'] as string, 10);
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  todo.completed = !todo.completed;
  res.json(todo);
});

// DELETE /todos/:id - delete
app.delete('/todos/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params['id'] as string, 10);
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  todos.splice(idx, 1);
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
