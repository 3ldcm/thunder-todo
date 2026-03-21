import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from '../../components/FilterBar';

describe('FilterBar', () => {
  it('renders buttons for All, Active, and Completed', () => {
    render(<FilterBar current="all" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^active$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^completed$/i })).toBeInTheDocument();
  });

  it('active filter button has aria-pressed="true"', () => {
    render(<FilterBar current="active" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /^active$/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /^all$/i })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: /^completed$/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('active filter button has "active" class', () => {
    render(<FilterBar current="completed" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /^completed$/i })).toHaveClass('active');
    expect(screen.getByRole('button', { name: /^all$/i })).not.toHaveClass('active');
  });

  it('clicking All button calls onChange with "all"', async () => {
    const onChange = vi.fn();
    render(<FilterBar current="active" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /^all$/i }));
    expect(onChange).toHaveBeenCalledWith('all');
  });

  it('clicking Active button calls onChange with "active"', async () => {
    const onChange = vi.fn();
    render(<FilterBar current="all" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /^active$/i }));
    expect(onChange).toHaveBeenCalledWith('active');
  });

  it('clicking Completed button calls onChange with "completed"', async () => {
    const onChange = vi.fn();
    render(<FilterBar current="all" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /^completed$/i }));
    expect(onChange).toHaveBeenCalledWith('completed');
  });

  it('when current is "all", All button has active class', () => {
    render(<FilterBar current="all" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /^all$/i })).toHaveClass('active');
  });
});
