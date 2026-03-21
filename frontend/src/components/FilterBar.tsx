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
    <div className="filter-bar">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={current === value ? 'active' : undefined}
          aria-pressed={current === value}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
