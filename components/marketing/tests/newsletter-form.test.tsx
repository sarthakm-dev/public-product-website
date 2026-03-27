import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRoutes } from '@/lib/routes';

const { toast } = vi.hoisted(() => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast,
}));

describe('NewsletterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollIntoView = vi.fn();
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
    const emailInput = screen.getByPlaceholderText('Enter your work email');

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Subscription failed', {
        description: 'Enter a valid email address.',
      });
    });
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('-hint')
    );
    await waitFor(() => {
      expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    });

    fireEvent.change(emailInput, {
      target: { value: 'team@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /join waitlist/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(apiRoutes.subscribe, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'team@example.com' }),
      });
    });

    expect(toast.success).toHaveBeenCalledWith('You are on the waitlist', {
      description: 'You are on the waitlist. Subscriber saved to Strapi.',
    });
  });

  it('shows an already-on-waitlist success toast for duplicate emails', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        message: 'You are already on the waitlist. Subscriber already exists.',
      }),
    } as unknown as Response);

    const { NewsletterForm } = await import('../newsletter-form');

    render(<NewsletterForm />);

    fireEvent.change(screen.getByPlaceholderText('Enter your work email'), {
      target: { value: 'team@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /join waitlist/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(apiRoutes.subscribe, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'team@example.com' }),
      });
    });

    expect(toast.success).toHaveBeenCalledWith(
      'You are already on the waitlist',
      {
        description:
          'You are already on the waitlist. Subscriber already exists.',
      }
    );
  });
});
