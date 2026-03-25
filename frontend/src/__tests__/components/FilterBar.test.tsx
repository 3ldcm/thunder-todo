import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from '../../components/FilterBar';

describe('FilterBar', () => {
  it('renders all three filter options: All, Active, Completed', () => {
    render(<FilterBar current="all" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /active/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /completed/i })).toBeInTheDocument();
  });

  it('active filter has aria-pressed="true"', () => {
    render(<FilterBar current="active" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /active/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /all/i })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: /completed/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('active filter is rendered as a Badge (div element)', () => {
    render(<FilterBar current="completed" onChange={() => {}} />);
    const completedBtn = screen.getByRole('button', { name: /completed/i });
    // Badge renders as a div; it should be in the document and clickable
    expect(completedBtn.tagName.toLowerCase()).toBe('div');
  });

  it('inactive filters are rendered as ghost Buttons (button elements)', () => {
    render(<FilterBar current="completed" onChange={() => {}} />);
    const allBtn = screen.getByRole('button', { name: /all/i });
    const activeBtn = screen.getByRole('button', { name: /active/i });
    expect(allBtn.tagName.toLowerCase()).toBe('button');
    expect(activeBtn.tagName.toLowerCase()).toBe('button');
  });

  it('clicking All button calls onChange with "all"', async () => {
    const onChange = vi.fn();
    render(<FilterBar current="active" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /all/i }));
    expect(onChange).toHaveBeenCalledWith('all');
  });

  it('clicking Active button calls onChange with "active"', async () => {
    const onChange = vi.fn();
    render(<FilterBar current="all" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /active/i }));
    expect(onChange).toHaveBeenCalledWith('active');
  });

  it('clicking Completed button calls onChange with "completed"', async () => {
    const onChange = vi.fn();
    render(<FilterBar current="all" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /completed/i }));
    expect(onChange).toHaveBeenCalledWith('completed');
  });

  it('when current is "all", All filter is rendered as Badge', () => {
    render(<FilterBar current="all" onChange={() => {}} />);
    const allBtn = screen.getByRole('button', { name: /all/i });
    expect(allBtn.tagName.toLowerCase()).toBe('div');
  });
});
