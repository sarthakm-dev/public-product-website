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

describe('DashboardStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads stats and triggers the mock crawl endpoint', async () => {
    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          totalSubscribers: 24,
          averageComplianceScore: 94,
          totalSitesCrawled: 310,
          accessibilityIssuesFound: 12,
          trend: [],
        }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          message: 'Mock crawl queued successfully for the current account.',
        }),
      } as unknown as Response);

    const { DashboardStats } = await import('../dashboard-stats');

    render(<DashboardStats />);

    expect(
      screen.getByText(`Loading \`${apiRoutes.stats}\``)
    ).toBeInTheDocument();
    expect(await screen.findByText('24')).toBeInTheDocument();
    expect(screen.getByText('94%')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /trigger mock crawl/i })
    );

    await waitFor(() => {
      expect(screen.getByText('Running mock crawl...')).toBeInTheDocument();
    });

    expect(
      await screen.findByText(
        'Mock crawl queued successfully for the current account.'
      )
    ).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith('Mock crawl queued', {
      description: 'Mock crawl queued successfully for the current account.',
    });

    expect(fetchMock).toHaveBeenNthCalledWith(1, apiRoutes.stats);
    expect(fetchMock).toHaveBeenNthCalledWith(2, apiRoutes.mockCrawl, {
      method: 'POST',
    });
  });
});
