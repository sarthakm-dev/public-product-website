import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('FeatureGrid', () => {
  it('renders feature cards', async () => {
    const { FeatureGrid } = await import('../feature-grid');

    render(
      <FeatureGrid
        features={[
          {
            id: 1,
            title: 'Scheduled scanning',
            description: 'Run scans every day.',
            icon: 'monitoring',
          },
        ]}
      />
    );

    expect(screen.getByText('Scheduled scanning')).toBeInTheDocument();
    expect(screen.getByText('Run scans every day.')).toBeInTheDocument();
  });
});
