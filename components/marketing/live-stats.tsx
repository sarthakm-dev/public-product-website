'use client';

import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card } from '@/components/ui/card';
import { useToast } from '@/components/common/toast-provider';
import { getErrorMessage } from '@/lib/api';
import type { StatsResponse } from '@/lib/types';

export function LiveStats() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;

    fetch('/api/stats')
      .then(async response => {
        if (!response.ok) {
          throw new Error('Failed to load stats');
        }

        return (await response.json()) as StatsResponse;
      })
      .then(payload => {
        if (active) {
          setData(payload);
        }
      })
      .catch((reason: Error) => {
        const message = getErrorMessage(reason, 'Failed to load stats');
        if (active) {
          setError(message);
          toast({
            variant: 'error',
            title: 'Unable to load live stats',
            description: message,
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Card className="p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">
            Live Monitoring Data
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            Real-time client-side metrics
          </h3>
        </div>
      </div>

      {error ? <p className="mt-6 text-sm text-rose-300">{error}</p> : null}

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat
          label="Total Sites Crawled"
          value={data?.totalSitesCrawled ?? 0}
        />
        <Stat
          label="Accessibility Issues"
          value={data?.accessibilityIssuesFound ?? 0}
        />
        <Stat
          label="Average Compliance"
          value={`${data?.averageComplianceScore ?? 0}%`}
        />
        <Stat label="Subscribers" value={data?.totalSubscribers ?? 0} />
      </div>

      <div className="mt-8 h-72 rounded-[28px] border border-white/10 bg-slate-950/40 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={Array.isArray(data?.trend) ? data.trend : []}>
            <defs>
              <linearGradient id="score" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.75} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="rgba(148, 163, 184, 0.12)"
              vertical={false}
            />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                background: '#020617',
                borderRadius: 16,
                border: '1px solid rgba(148,163,184,0.15)',
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#22d3ee"
              fillOpacity={1}
              fill="url(#score)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
