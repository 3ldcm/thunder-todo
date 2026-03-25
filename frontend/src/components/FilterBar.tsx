type Filter = 'all' | 'active' | 'completed';

interface FilterBarProps {
  current: Filter;
  onChange: (filter: Filter) => void;
}

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

export function FilterBar({ current, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-2" role="group" aria-label="Filter todos">
      {FILTERS.map(({ label, value }) => {
        const isActive = current === value;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            aria-pressed={isActive}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              isActive
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
