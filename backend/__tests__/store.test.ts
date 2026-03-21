import { getTodos, createTodo, updateTodo, deleteTodo, resetStore } from '../src/store';

beforeEach(() => {
  resetStore();
});

describe('store', () => {
  describe('getTodos', () => {
    it('returns all todos when no filter is provided', () => {
      createTodo('Task 1');
      createTodo('Task 2');
      const result = getTodos();
      expect(result).toHaveLength(2);
    });

    it('returns only active todos when filter is "active"', () => {
      const t1 = createTodo('Task 1');
      createTodo('Task 2');
      updateTodo(t1.id, true);
      const result = getTodos('active');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Task 2');
      expect(result[0].completed).toBe(false);
    });

    it('returns only completed todos when filter is "completed"', () => {
      const t1 = createTodo('Task 1');
      createTodo('Task 2');
      updateTodo(t1.id, true);
      const result = getTodos('completed');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Task 1');
      expect(result[0].completed).toBe(true);
    });
  });

  describe('createTodo', () => {
    it('creates a todo with completed false and a non-empty id', () => {
      const todo = createTodo('My task');
      expect(todo.id).toBeTruthy();
      expect(todo.id.length).toBeGreaterThan(0);
      expect(todo.title).toBe('My task');
      expect(todo.completed).toBe(false);
      expect(todo.createdAt).toBeTruthy();
    });
  });

  describe('updateTodo', () => {
    it('sets completed to true on the correct todo', () => {
      const todo = createTodo('Task to complete');
      const result = updateTodo(todo.id, true);
      expect(result).not.toBeNull();
      expect(result!.completed).toBe(true);
      // verify it persisted
      const all = getTodos();
      expect(all[0].completed).toBe(true);
    });

    it('returns null for a nonexistent id', () => {
      const result = updateTodo('nonexistent-id', true);
      expect(result).toBeNull();
    });
  });

  describe('deleteTodo', () => {
    it('removes the todo and returns true', () => {
      const todo = createTodo('Task to delete');
      const result = deleteTodo(todo.id);
      expect(result).toBe(true);
      expect(getTodos()).toHaveLength(0);
    });

    it('returns false for a nonexistent id', () => {
      const result = deleteTodo('nonexistent-id');
      expect(result).toBe(false);
    });
  });
});
