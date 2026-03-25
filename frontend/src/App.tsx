import { useState, useEffect } from 'react';
import { fetchTodos, createTodo, toggleTodo, deleteTodo } from './api';
import { AddTodoForm } from './components/AddTodoForm';
import { FilterBar } from './components/FilterBar';
import { TodoItem } from './components/TodoItem';
import type { Todo } from './types';

type Filter = 'all' | 'active' | 'completed';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = async (status: Filter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTodos(status);
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTodos(filter);
  }, [filter]);

  const handleAdd = async (title: string) => {
    try {
      await createTodo(title);
      await loadTodos(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await toggleTodo(id, completed);
      await loadTodos(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      await loadTodos(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Thunder Todo</h1>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6 shadow-2xl shadow-black/40">
          <AddTodoForm onAdd={(title) => { void handleAdd(title); }} />

          <div className="mt-5 mb-4">
            <FilterBar current={filter} onChange={setFilter} />
          </div>

          {loading && (
            <div className="flex items-center justify-center py-10">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm mt-3">{error}</p>
          )}

          {!loading && todos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">Nothing here yet.</p>
            </div>
          )}

          <div className="space-y-2 mt-4">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={(id, completed) => { void handleToggle(id, completed); }}
                onDelete={(id) => { void handleDelete(id); }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
