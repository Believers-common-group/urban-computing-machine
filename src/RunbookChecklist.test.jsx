import { expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RunbookChecklist from './RunbookChecklist';

test('renders all four section headings', () => {
  render(<RunbookChecklist />);
  expect(screen.getByText(/Genesis Edge Node Stack Setup/i)).toBeDefined();
  expect(screen.getByText(/Verifying Deployments/i)).toBeDefined();
  expect(screen.getByText(/Configuring Backups/i)).toBeDefined();
  expect(screen.getByText(/CI\/CD Pipeline Integration/i)).toBeDefined();
});

test('renders Print Checklist button', () => {
  render(<RunbookChecklist />);
  expect(screen.getByRole('button', { name: /print runbook/i })).toBeDefined();
});

test('shows 0 completed steps initially', () => {
  render(<RunbookChecklist />);
  expect(screen.getByText(/0\/\d+ steps/i)).toBeDefined();
});

test('checking a step increments the completed count', () => {
  render(<RunbookChecklist />);
  const checkboxes = screen.getAllByRole('checkbox');
  fireEvent.click(checkboxes[0]);
  expect(screen.getByText(/1\/\d+ steps/i)).toBeDefined();
});

test('unchecking a step decrements the completed count', () => {
  render(<RunbookChecklist />);
  const checkboxes = screen.getAllByRole('checkbox');
  fireEvent.click(checkboxes[0]);
  fireEvent.click(checkboxes[0]);
  expect(screen.getByText(/0\/\d+ steps/i)).toBeDefined();
});

test('renders signature fields', () => {
  render(<RunbookChecklist />);
  expect(screen.getByText(/Technician Name/i)).toBeDefined();
  expect(screen.getByText(/Date Completed/i)).toBeDefined();
});
