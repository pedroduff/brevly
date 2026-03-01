import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

function renderWithProviders(ui: ReactElement, initialEntry = '/') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('App', () => {
  it('renders home with Novo link heading when on /', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('heading', { name: /novo link/i })).toBeInTheDocument();
  });
});
