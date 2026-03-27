import { render, screen } from '@testing-library/react';
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

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({
    children,
    data,
  }: {
    children: React.ReactNode;
    data: Array<{ label: string; score: number }>;
  }) => <div data-points={data.length}>{children}</div>,
  Area: () => <div data-testid="area-chart-series" />,
  CartesianGrid: () => <div />,
  Legend: () => <div />,
  Tooltip: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
}));

describe('LiveStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads live stats and shows request errors', async () => {
    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          totalSitesCrawled: 512,
          accessibilityIssuesFound: 34,
          averageComplianceScore: 96,
          totalSubscribers: 110,
          trend: [
            { label: 'Jan', score: 90 },
            { label: 'Feb', score: 96 },
          ],
        }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      } as unknown as Response);

    const { LiveStats } = await import('../live-stats');

    const firstRender = render(<LiveStats />);

    expect(await screen.findByText('512')).toBeInTheDocument();
    expect(screen.getByText('96%')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();

    firstRender.unmount();
    render(<LiveStats />);

    expect(await screen.findByText('Failed to load stats')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(apiRoutes.stats);
    expect(toast.error).toHaveBeenCalledWith('Unable to load live stats', {
      description: 'Failed to load stats',
    });
  });
});
