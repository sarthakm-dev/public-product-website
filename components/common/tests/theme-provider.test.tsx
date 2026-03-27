import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const nextThemesProviderMock = vi.fn();

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children, ...props }: { children: React.ReactNode }) => {
    nextThemesProviderMock(props);
    return <div data-testid="mock-theme-provider">{children}</div>;
  },
}));

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards props to next-themes and renders children', async () => {
    const { ThemeProvider } = await import('../theme-provider');

    render(
      <ThemeProvider attribute="class" defaultTheme="system">
        <span>Theme content</span>
      </ThemeProvider>
    );

    expect(screen.getByText('Theme content')).toBeInTheDocument();
    expect(nextThemesProviderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        attribute: 'class',
        defaultTheme: 'system',
      })
    );
  });
});
