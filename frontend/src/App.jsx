import { useState, useEffect } from 'react';

const API = '/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchTodos = async (status = 'all') => {
    const url = status === 'all' ? API : `${API}?status=${status}`;
    const res = await fetch(url);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => { fetchTodos(filter); }, [filter]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    setText('');
    await fetchTodos(filter);
    setLoading(false);
  };

  const toggleTodo = async (id) => {
    await fetch(`${API}/${id}`, { method: 'PATCH' });
    await fetchTodos(filter);
  };

  const deleteTodo = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    await fetchTodos(filter);
  };

  return (
    <div className="app">
      <h1>⚡ Thunder Todo</h1>

      <form className="add-form" onSubmit={addTodo}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
        />
        <button type="submit" disabled={loading}>Add</button>
      </form>

      <div className="filters">
        {['all', 'active', 'completed'].map(f => (
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
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
