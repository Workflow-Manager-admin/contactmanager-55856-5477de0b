import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Contact Manager title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Contact Manager/i);
  expect(titleElement).toBeInTheDocument();
});
