import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as api from '../api';
import type { Todo } from '../types';

vi.mock('../api');

const mockFetchTodos = vi.mocked(api.fetchTodos);
const mockCreateTodo = vi.mocked(api.createTodo);
const mockToggleTodo = vi.mocked(api.toggleTodo);
const mockDeleteTodo = vi.mocked(api.deleteTodo);

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: '1',
  title: 'Test todo',
  completed: false,
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe('App integration tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchTodos.mockResolvedValue([]);
    mockCreateTodo.mockResolvedValue(makeTodo());
    mockToggleTodo.mockResolvedValue(makeTodo({ completed: true }));
    mockDeleteTodo.mockResolvedValue(undefined);
  });

  it('calls fetchTodos on initial render', async () => {
    render(<App />);
    await waitFor(() => {
      expect(mockFetchTodos).toHaveBeenCalledTimes(1);
      expect(mockFetchTodos).toHaveBeenCalledWith('all');
    });
  });

  it('calls fetchTodos again when filter changes', async () => {
    render(<App />);
    await waitFor(() => expect(mockFetchTodos).toHaveBeenCalledTimes(1));

    await userEvent.click(screen.getByRole('button', { name: 'Active' }));
    await waitFor(() => {
      expect(mockFetchTodos).toHaveBeenCalledWith('active');
    });

    await userEvent.click(screen.getByRole('button', { name: 'Completed' }));
    await waitFor(() => {
      expect(mockFetchTodos).toHaveBeenCalledWith('completed');
    });
  });

  it('calls createTodo and refreshes list when adding a todo', async () => {
    mockFetchTodos.mockResolvedValueOnce([]).mockResolvedValueOnce([makeTodo({ title: 'Buy milk' })]);

    render(<App />);
    await waitFor(() => expect(mockFetchTodos).toHaveBeenCalledTimes(1));

    const input = screen.getByPlaceholderText('What needs to be done?');
    await userEvent.type(input, 'Buy milk');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith('Buy milk');
      expect(mockFetchTodos).toHaveBeenCalledTimes(2);
    });
  });

  it('calls toggleTodo and refreshes list when toggling a todo', async () => {
    const todo = makeTodo({ id: '42', title: 'Toggle me', completed: false });
    mockFetchTodos.mockResolvedValue([todo]);

    render(<App />);
    await waitFor(() => screen.getByText('Toggle me'));

    const checkbox = screen.getByRole('checkbox', { name: /Toggle me/ });
    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(mockToggleTodo).toHaveBeenCalledWith('42', true);
    });
    expect(mockFetchTodos).toHaveBeenCalledTimes(2);
  });

  it('calls deleteTodo and refreshes list when deleting a todo', async () => {
    const todo = makeTodo({ id: '99', title: 'Delete me', completed: false });
    mockFetchTodos.mockResolvedValueOnce([todo]).mockResolvedValueOnce([]);

    render(<App />);
    await waitFor(() => screen.getByText('Delete me'));

    const deleteBtn = screen.getByRole('button', { name: /Delete "Delete me"/ });
    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockDeleteTodo).toHaveBeenCalledWith('99');
      expect(mockFetchTodos).toHaveBeenCalledTimes(2);
    });
  });

  it('shows Loading... while API call is in flight', async () => {
    let resolve!: (value: Todo[]) => void;
    mockFetchTodos.mockReturnValueOnce(new Promise((r) => { resolve = r; }));

    render(<App />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    resolve([]);
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
  });

  it('shows error message when API call rejects', async () => {
    mockFetchTodos.mockRejectedValueOnce(new Error('Network failure'));

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Network failure')).toBeInTheDocument();
    });
  });

  it('shows empty state when no todos match the filter', async () => {
    mockFetchTodos.mockResolvedValue([]);

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('No todos here!')).toBeInTheDocument();
    });
  });
});
