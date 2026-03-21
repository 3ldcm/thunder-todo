import { Router, Request, Response } from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../store';

const router = Router();

// GET / — list todos, optional ?status=all|active|completed
router.get('/', (req: Request, res: Response) => {
  const status = req.query['status'] as string | undefined;
  let filter: 'all' | 'active' | 'completed' | undefined;
  if (status === 'active' || status === 'completed' || status === 'all') {
    filter = status;
  }
  const result = getTodos(filter);
  res.status(200).json(result);
});

// POST / — create todo
router.post('/', (req: Request, res: Response) => {
  const { title } = req.body as { title?: string };
  if (!title || !title.trim()) {
    res.status(400).json({ error: 'title is required' });
    return;
  }
  const todo = createTodo(title.trim());
  res.status(201).json(todo);
});

// PATCH /:id — update todo
router.patch('/:id', (req: Request, res: Response) => {
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
  res.status(200).json(todo);
});

// DELETE /:id — delete todo
router.delete('/:id', (req: Request, res: Response) => {
  const id = req.params['id'] as string;
  const deleted = deleteTodo(id);
  if (!deleted) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.status(204).send();
});

export default router;
