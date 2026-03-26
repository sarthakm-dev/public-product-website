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

describe('Hero', () => {
  it('renders fallbacks and custom CTA content', async () => {
    const { Hero } = await import('../hero');

    const { rerender } = render(<Hero landingPage={null} />);

    expect(
      screen.getByText(
        'CMS content missing: create Landing Page hero in Strapi.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /start free crawl/i })
    ).toHaveAttribute('href', '/signup');

    rerender(
      <Hero
        landingPage={{
          hero: {
            title: 'Ship accessible monitoring',
            subtitle: 'Track compliance over time.',
            primaryCtaLabel: 'Book Demo',
            primaryCtaHref: '/demo',
            secondaryCtaLabel: 'See Plans',
            secondaryCtaHref: '/pricing',
          },
        }}
      />
    );

    expect(screen.getByText('Ship accessible monitoring')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /book demo/i })).toHaveAttribute(
      'href',
      '/demo'
    );
    expect(screen.getByRole('link', { name: /see plans/i })).toHaveAttribute(
      'href',
      '/pricing'
    );
  });
});
