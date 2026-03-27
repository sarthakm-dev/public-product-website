import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

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

describe('SiteFooter', () => {
  it('renders site copy and footer links', async () => {
    const { SiteFooter } = await import('../site-footer');

    render(<SiteFooter />);

    expect(
      screen.getByText('Web Crawl Accessibility & Compliance Monitoring')
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute(
      'href',
      '/login'
    );
  });
});
