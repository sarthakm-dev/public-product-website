import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { RouteSectionPlaceholder } from '@/components/common/route-section-placeholder';
import { Card } from '@/components/ui/card';
import { authOptions } from '@/lib/auth-options';

const SignOutButton = dynamic(
  () =>
    import('@/components/auth/sign-out-button').then(mod => mod.SignOutButton),
  {
    loading: () => (
      <div className="h-9 w-24 animate-pulse rounded-full bg-white/10" />
    ),
  }
);

const DashboardStats = dynamic(
  () =>
    import('@/components/common/dashboard-stats').then(
      mod => mod.DashboardStats
    ),
  {
    loading: () => (
      <RouteSectionPlaceholder
        label="dashboard-stats"
        title="Loading dashboard stats"
        className="p-8"
        lines={4}
      />
    ),
  }
);

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">
          Dashboard
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-white">
          Protected workspace
        </h1>
      </div>

      <Card className="mb-6 p-8">
        <p className="text-sm text-slate-400">Authenticated user</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {session.user.name ?? 'User'}
        </h2>
        <p className="mt-2 text-slate-300">{session.user.email}</p>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </Card>

      <DashboardStats />
    </section>
  );
}
