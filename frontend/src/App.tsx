import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

type FilterStatus = 'all' | 'active' | 'completed';

const API = '/api/todos';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [loading, setLoading] = useState(false);

  const fetchTodos = async (status: FilterStatus = 'all') => {
    const url = status === 'all' ? API : `${API}?status=${status}`;
    const res = await fetch(url);
    const data = await res.json() as Todo[];
    setTodos(data);
  };

  useEffect(() => { void fetchTodos(filter); }, [filter]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: text }),
    });
    setText('');
    await fetchTodos(filter);
    setLoading(false);
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    await fetchTodos(filter);
  };

  const deleteTodo = async (id: string) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    await fetchTodos(filter);
  };

  return (
    <div className="app">
      <h1>Thunder Todo</h1>

      <form className="add-form" onSubmit={(e) => { void addTodo(e); }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
        />
        <button type="submit" disabled={loading}>Add</button>
      </form>

      <div className="filters">
        {(['all', 'active', 'completed'] as FilterStatus[]).map(f => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul className="todo-list">
        {todos.length === 0 && (
          <p className="empty">No todos here. Add one above!</p>
        )}
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item${todo.completed ? ' completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => { void toggleTodo(todo.id, todo.completed); }}
            />
            <span>{todo.title}</span>
            <button className="delete-btn" onClick={() => { void deleteTodo(todo.id); }}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
