import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTodos, createTodo, toggleTodo, deleteTodo } from '../api';
import type { Todo } from '../types';

const mockTodo: Todo = {
  id: '1',
  title: 'Test todo',
  completed: false,
  createdAt: '2026-01-01T00:00:00.000Z',
};

function mockFetchOk(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status,
    statusText: 'OK',
    json: () => Promise.resolve(body),
  });
}

function mockFetchFail(status = 500, statusText = 'Internal Server Error') {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText,
    json: () => Promise.resolve({ error: 'fail' }),
  });
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchTodos', () => {
  it('calls GET /api/todos with no status param', async () => {
    const mockFetch = mockFetchOk([mockTodo]);
    vi.stubGlobal('fetch', mockFetch);

    const result = await fetchTodos();

    expect(mockFetch).toHaveBeenCalledWith('/api/todos');
    expect(result).toEqual([mockTodo]);
  });

  it('calls GET /api/todos?status=active when status=active', async () => {
    const mockFetch = mockFetchOk([mockTodo]);
    vi.stubGlobal('fetch', mockFetch);

    await fetchTodos('active');

    expect(mockFetch).toHaveBeenCalledWith('/api/todos?status=active');
  });

  it('calls GET /api/todos?status=completed when status=completed', async () => {
    const mockFetch = mockFetchOk([]);
    vi.stubGlobal('fetch', mockFetch);

    await fetchTodos('completed');

    expect(mockFetch).toHaveBeenCalledWith('/api/todos?status=completed');
  });

  it('calls GET /api/todos?status=all when status=all', async () => {
    const mockFetch = mockFetchOk([mockTodo]);
    vi.stubGlobal('fetch', mockFetch);

    await fetchTodos('all');

    expect(mockFetch).toHaveBeenCalledWith('/api/todos?status=all');
  });

  it('throws when response is not ok', async () => {
    vi.stubGlobal('fetch', mockFetchFail(404, 'Not Found'));

    await expect(fetchTodos()).rejects.toThrow('Request failed: 404 Not Found');
  });
});

describe('createTodo', () => {
  it('calls POST /api/todos with correct body', async () => {
    const mockFetch = mockFetchOk(mockTodo, 201);
    vi.stubGlobal('fetch', mockFetch);

    const result = await createTodo('buy milk');

    expect(mockFetch).toHaveBeenCalledWith('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'buy milk' }),
    });
    expect(result).toEqual(mockTodo);
  });

  it('throws when response is not ok', async () => {
    vi.stubGlobal('fetch', mockFetchFail(400, 'Bad Request'));

    await expect(createTodo('bad')).rejects.toThrow('Request failed: 400 Bad Request');
  });
});

describe('toggleTodo', () => {
  it('calls PATCH /api/todos/:id with body { completed: true }', async () => {
    const completedTodo = { ...mockTodo, completed: true };
    const mockFetch = mockFetchOk(completedTodo);
    vi.stubGlobal('fetch', mockFetch);

    const result = await toggleTodo('1', true);

    expect(mockFetch).toHaveBeenCalledWith('/api/todos/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    });
    expect(result).toEqual(completedTodo);
  });

  it('calls PATCH /api/todos/:id with body { completed: false }', async () => {
    const mockFetch = mockFetchOk(mockTodo);
    vi.stubGlobal('fetch', mockFetch);

    await toggleTodo('1', false);

    expect(mockFetch).toHaveBeenCalledWith('/api/todos/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: false }),
    });
  });

  it('throws when response is not ok', async () => {
    vi.stubGlobal('fetch', mockFetchFail(404, 'Not Found'));

    await expect(toggleTodo('999', true)).rejects.toThrow('Request failed: 404 Not Found');
  });
});

describe('deleteTodo', () => {
  it('calls DELETE /api/todos/:id', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      statusText: 'No Content',
    });
    vi.stubGlobal('fetch', mockFetch);

    await deleteTodo('1');

    expect(mockFetch).toHaveBeenCalledWith('/api/todos/1', {
      method: 'DELETE',
    });
  });

  it('throws when response is not ok', async () => {
    vi.stubGlobal('fetch', mockFetchFail(404, 'Not Found'));

    await expect(deleteTodo('999')).rejects.toThrow('Request failed: 404 Not Found');
  });
});
