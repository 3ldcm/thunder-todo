import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddTodoForm } from '../../components/AddTodoForm';

describe('AddTodoForm', () => {
  it('has an input and a button labeled Add', () => {
    render(<AddTodoForm onAdd={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^add$/i })).toBeInTheDocument();
  });

  it('calls onAdd with trimmed title on submit with non-empty input', async () => {
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} />);
    await userEvent.type(screen.getByRole('textbox'), '  Buy groceries  ');
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(onAdd).toHaveBeenCalledWith('Buy groceries');
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onAdd when input is empty', async () => {
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} />);
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('does NOT call onAdd when input is only whitespace', async () => {
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} />);
    await userEvent.type(screen.getByRole('textbox'), '   ');
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('clears input after successful submit', async () => {
    render(<AddTodoForm onAdd={() => {}} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Buy groceries');
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(input).toHaveValue('');
  });

  it('does not clear input when submit fails (empty)', async () => {
    render(<AddTodoForm onAdd={() => {}} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '  ');
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(input).toHaveValue('  ');
  });

  it('submits via Enter key', async () => {
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} />);
    await userEvent.type(screen.getByRole('textbox'), 'Press enter{Enter}');
    expect(onAdd).toHaveBeenCalledWith('Press enter');
  });
});
