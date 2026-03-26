import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Testimonials', () => {
  it('renders testimonials and use cases', async () => {
    const { Testimonials } = await import('../testimonials');

    render(
      <Testimonials
        testimonials={[
          {
            quote: 'We fixed issues before launch.',
            author: 'Jamie',
            role: 'QA Lead',
          },
        ]}
        useCases={[
          {
            title: 'Agency reporting',
            description: 'Share progress with clients.',
          },
        ]}
      />
    );

    expect(
      screen.getByText(/we fixed issues before launch/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Agency reporting')).toBeInTheDocument();
  });
});
