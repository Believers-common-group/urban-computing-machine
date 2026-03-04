import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Genesis Edge Node runbook heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { level: 1, name: /Genesis Edge Node/i });
  expect(heading).toBeDefined();
});
