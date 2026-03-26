import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('SectionShell', () => {
  it('renders eyebrow, description, and children', async () => {
    const { SectionShell } = await import('../section-shell');

    render(
      <SectionShell
        eyebrow="Insights"
        title="Everything in one place"
        description="From scans to compliance reports."
      >
        <div>Nested section content</div>
      </SectionShell>
    );

    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('Everything in one place')).toBeInTheDocument();
    expect(screen.getByText('Nested section content')).toBeInTheDocument();
  });
});
