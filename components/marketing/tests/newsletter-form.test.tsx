import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const toastMock = vi.fn();

vi.mock('@/components/common/toast-provider', () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}));

describe('NewsletterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates input and submits to the subscribe API', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        message: 'You are on the waitlist. Subscriber saved to Strapi.',
      }),
    } as unknown as Response);

    const { NewsletterForm } = await import('../newsletter-form');

    render(<NewsletterForm />);

    fireEvent.click(screen.getByRole('button', { name: /join waitlist/i }));
    expect(
      await screen.findByText('Enter a valid email address.')
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Enter your work email'), {
      target: { value: 'team@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /join waitlist/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'team@example.com' }),
      });
    });

    expect(toastMock).toHaveBeenCalledWith({
      variant: 'success',
      title: 'You are on the waitlist',
      description: 'You are on the waitlist. Subscriber saved to Strapi.',
    });
  });
});
