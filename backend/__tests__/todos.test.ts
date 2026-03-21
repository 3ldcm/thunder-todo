import request from 'supertest';
import app from '../src/app';
import { resetStore } from '../src/store';

beforeEach(() => {
  resetStore();
});

describe('GET /api/todos', () => {
  it('returns 200 with an empty array', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  it('returns all todos', async () => {
    await request(app).post('/api/todos').send({ title: 'Task 1' });
    await request(app).post('/api/todos').send({ title: 'Task 2' });
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('returns only active todos with ?status=active', async () => {
    const createRes = await request(app).post('/api/todos').send({ title: 'Task 1' });
    await request(app).post('/api/todos').send({ title: 'Task 2' });
    await request(app).patch(`/api/todos/${createRes.body.id}`).send({ completed: true });

    const res = await request(app).get('/api/todos?status=active');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].completed).toBe(false);
  });

  it('returns only completed todos with ?status=completed', async () => {
    const createRes = await request(app).post('/api/todos').send({ title: 'Task 1' });
    await request(app).post('/api/todos').send({ title: 'Task 2' });
    await request(app).patch(`/api/todos/${createRes.body.id}`).send({ completed: true });

    const res = await request(app).get('/api/todos?status=completed');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].completed).toBe(true);
  });
});

describe('POST /api/todos', () => {
  it('creates a todo and returns 201', async () => {
    const res = await request(app).post('/api/todos').send({ title: 'test' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: 'test',
      completed: false,
    });
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/api/todos').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when title is empty string', async () => {
    const res = await request(app).post('/api/todos').send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when title is only whitespace', async () => {
    const res = await request(app).post('/api/todos').send({ title: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('PATCH /api/todos/:id', () => {
  it('returns 200 with updated todo for valid id', async () => {
    const createRes = await request(app).post('/api/todos').send({ title: 'Task' });
    const id = createRes.body.id;

    const res = await request(app).patch(`/api/todos/${id}`).send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
    expect(res.body.completed).toBe(true);
  });

  it('returns 404 for invalid id', async () => {
    const res = await request(app).patch('/api/todos/nonexistent-id').send({ completed: true });
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('can mark a todo as incomplete', async () => {
    const createRes = await request(app).post('/api/todos').send({ title: 'Task' });
    const id = createRes.body.id;
    await request(app).patch(`/api/todos/${id}`).send({ completed: true });

    const res = await request(app).patch(`/api/todos/${id}`).send({ completed: false });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(false);
  });
});

describe('DELETE /api/todos/:id', () => {
  it('returns 204 on successful delete', async () => {
    const createRes = await request(app).post('/api/todos').send({ title: 'Task' });
    const id = createRes.body.id;

    const res = await request(app).delete(`/api/todos/${id}`);
    expect(res.status).toBe(204);
  });

  it('removes todo from the list after delete', async () => {
    const createRes = await request(app).post('/api/todos').send({ title: 'Task' });
    const id = createRes.body.id;
    await request(app).delete(`/api/todos/${id}`);

    const listRes = await request(app).get('/api/todos');
    expect(listRes.body).toHaveLength(0);
  });

  it('returns 404 for invalid id', async () => {
    const res = await request(app).delete('/api/todos/nonexistent-id');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});
