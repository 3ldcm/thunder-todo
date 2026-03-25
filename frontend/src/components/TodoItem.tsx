import { Trash2 } from 'lucide-react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="group flex items-center gap-3 p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/20">
      <button
        onClick={() => onToggle(todo.id, !todo.completed)}
        aria-label={`Toggle "${todo.title}"`}
        className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
          todo.completed
            ? 'bg-blue-500 border-blue-500 text-white'
            : 'border-slate-500 hover:border-blue-400'
        }`}
      >
        {todo.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <span
        className={`flex-1 text-sm transition-all duration-200 ${
          todo.completed
            ? 'text-slate-500 line-through'
            : 'text-slate-200'
        }`}
      >
        {todo.title}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.title}"`}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-slate-500 hover:text-red-400 p-1 rounded-md focus:outline-none focus:opacity-100 focus:ring-2 focus:ring-red-500/50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
