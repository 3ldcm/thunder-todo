import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock fetch globally so the component doesn't try to call the backend
const fetchMock = vi.fn().mockResolvedValue({
  json: async () => [],
});
vi.stubGlobal('fetch', fetchMock);

describe('App smoke test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock.mockResolvedValue({ json: async () => [] });
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeTruthy();
  });

  it('renders the Thunder Todo heading', () => {
    render(<App />);
    expect(screen.getByText('Thunder Todo')).toBeInTheDocument();
  });

  it('renders the add form', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('renders filter buttons', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Active' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Completed' })).toBeInTheDocument();
  });
});
