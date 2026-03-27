import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const setThemeMock = vi.fn();
let resolvedThemeMock = 'dark';

vi.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: resolvedThemeMock,
    setTheme: setThemeMock,
  }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resolvedThemeMock = 'dark';
  });

  it('switches between light and dark themes', async () => {
    const { ThemeToggle } = await import('../theme-toggle');

    render(<ThemeToggle />);

    fireEvent.click(screen.getByLabelText('Switch to light mode'));
    fireEvent.click(screen.getByLabelText('Switch to dark mode'));

    expect(setThemeMock).toHaveBeenNthCalledWith(1, 'light');
    expect(setThemeMock).toHaveBeenNthCalledWith(2, 'dark');
  });
});
