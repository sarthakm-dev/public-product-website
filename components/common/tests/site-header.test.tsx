import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/common/theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

describe('SiteHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation and opens the mobile menu', async () => {
    const { SiteHeader } = await import('../site-header');

    render(<SiteHeader />);

    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getAllByText('Features')).toHaveLength(1);

    fireEvent.click(screen.getByLabelText('Open menu'));

    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    expect(screen.getAllByText('Features')).toHaveLength(2);
    expect(
      screen.getByRole('link', { name: /start free crawl/i })
    ).toHaveAttribute('href', '/signup');
  });
});
