const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve frontend static files if built (Docker production)
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// In-memory store
let todos = [];
let nextId = 1;

// GET /todos - list all (optional ?status=active|completed)
app.get('/todos', (req, res) => {
  const { status } = req.query;
  let result = todos;
  if (status === 'active') result = todos.filter(t => !t.completed);
  else if (status === 'completed') result = todos.filter(t => t.completed);
  res.json(result);
});

// POST /todos - create
app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  const todo = { id: nextId++, text: text.trim(), completed: false, createdAt: new Date().toISOString() };
  todos.push(todo);
  res.status(201).json(todo);
});

// PATCH /todos/:id - toggle complete
app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Not found' });
  todo.completed = !todo.completed;
  res.json(todo);
});

// DELETE /todos/:id - delete
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  todos.splice(idx, 1);
  res.status(204).send();
});

// Fallback: serve frontend for non-API routes
const fs = require('fs');
const indexFile = path.join(publicDir, 'index.html');
if (fs.existsSync(indexFile)) {
  app.get('*', (req, res) => res.sendFile(indexFile));
}

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
