import { Todo } from './types';

// Module-level todos array
const todos: Todo[] = [];

export function getTodos(filter?: 'all' | 'active' | 'completed'): Todo[] {
  if (!filter || filter === 'all') {
    return [...todos];
  }
  if (filter === 'active') {
    return todos.filter((t) => !t.completed);
  }
  return todos.filter((t) => t.completed);
}

export function createTodo(title: string): Todo {
  const todo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  return todo;
}

export function updateTodo(id: string, completed: boolean): Todo | null {
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return null;
  }
  todo.completed = completed;
  return todo;
}

export function deleteTodo(id: string): boolean {
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) {
    return false;
  }
  todos.splice(idx, 1);
  return true;
}

export function resetStore(): void {
  todos.length = 0;
}
