import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('PricingGrid', () => {
  it('renders plan details and the popular badge', async () => {
    const { PricingGrid } = await import('../pricing-grid');

    render(
      <PricingGrid
        plans={[
          {
            id: 1,
            name: 'Growth',
            price: 29,
            description: 'For growing teams',
            features: ['Weekly crawl', 'CSV exports'],
            ctaLabel: 'Choose Growth',
            isPopular: true,
          },
        ]}
      />
    );

    expect(screen.getByText('Most Popular')).toBeInTheDocument();
    expect(screen.getByText('$29.00')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Choose Growth' })
    ).toBeInTheDocument();
  });
});
