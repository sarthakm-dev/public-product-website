'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getErrorMessage, parseJsonSafely } from '@/lib/api';
import { apiRoutes } from '@/lib/routes';
import type { StatsResponse } from '@/lib/types';

export function DashboardStats() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiRoutes.stats)
      .then(async response => {
        if (!response.ok) {
          throw new Error('Failed to load dashboard stats.');
        }

        return response.json() as Promise<StatsResponse>;
      })
      .then(payload => setStats(payload))
      .catch(error => {
        toast.error('Unable to load dashboard stats', {
          description: getErrorMessage(
            error,
            'Failed to load dashboard stats.'
          ),
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const triggerMockCrawl = async () => {
    setStatus('Running mock crawl...');
    try {
      const response = await fetch(apiRoutes.mockCrawl, { method: 'POST' });
      const payload = await parseJsonSafely<{
        message?: string;
        error?: string;
      }>(response);

      if (!response.ok) {
        const message = payload?.error ?? 'Unable to trigger mock crawl.';
        setStatus(message);
        toast.error('Mock crawl failed', {
          description: message,
        });
        return;
      }

      const message = payload?.message ?? 'Mock crawl finished.';
      setStatus(message);
      toast.success('Mock crawl queued', {
        description: message,
      });
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to trigger mock crawl.');
      setStatus(message);
      toast.error('Mock crawl failed', {
        description: message,
      });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <Card className="p-8">
        <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">
          Dashboard Metrics
        </p>
        {loading ? (
          <div className="mt-6 space-y-4" aria-hidden="true">
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`dashboard-stat-skeleton-${index}`}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5"
                >
                  <Skeleton className="h-4 w-28 bg-white/10" />
                  <Skeleton className="mt-4 h-8 w-20 bg-white/10" />
                </div>
              ))}
            </div>
            <span className="sr-only">{`Loading \`${apiRoutes.stats}\``}</span>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <StatCard
              label="Subscribers from API"
              value={stats?.totalSubscribers ?? 0}
            />
            <StatCard
              label="Compliance Score"
              value={`${stats?.averageComplianceScore ?? 0}%`}
            />
            <StatCard
              label="Sites Crawled"
              value={stats?.totalSitesCrawled ?? 0}
            />
            <StatCard
              label="Issues Logged"
              value={stats?.accessibilityIssuesFound ?? 0}
            />
          </div>
        )}
      </Card>
      <Card className="p-8">
        <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">
          Crawl Controls
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-white">
          Trigger a mock crawl from the protected dashboard
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          This button calls a protected API route and simulates a crawl kickoff
          without leaving the dashboard.
        </p>
        <Button className="mt-6" onClick={triggerMockCrawl}>
          Trigger Mock Crawl
        </Button>
        {status ? <p className="mt-4 text-sm text-cyan-200">{status}</p> : null}
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
