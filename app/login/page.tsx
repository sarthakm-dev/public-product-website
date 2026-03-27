import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { SectionSkeleton } from '@/components/common/section-skeleton';
import { authOptions } from '@/lib/auth-options';

const LoginForm = dynamic(
  () => import('@/components/auth/login-form').then(mod => mod.LoginForm),
  {
    loading: () => (
      <SectionSkeleton
        label="login-form"
        title="Loading login form"
        className="mx-auto max-w-xl p-8"
      />
    ),
  }
);

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <LoginForm />
    </section>
  );
}
