import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const queryClient = new QueryClient();

describe('App Component', () => {
  it('renders the Dashboard header', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );
    const headerElements = screen.getAllByText(/Delivery Dashboard/i);
    expect(headerElements.length).toBeGreaterThan(0);
  });
});
