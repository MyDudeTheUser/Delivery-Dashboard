import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders the dashboard header', () => {
    render(<App />);

    expect(screen.getAllByText(/Delivery Dashboard/i).length).toBeGreaterThan(0);
  });
});
