import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { RouteSectionPlaceholder } from '@/components/common/route-section-placeholder';
import { authOptions } from '@/lib/auth-options';

const SignupForm = dynamic(
  () => import('@/components/auth/signup-form').then(mod => mod.SignupForm),
  {
    loading: () => (
      <RouteSectionPlaceholder
        label="signup-form"
        title="Loading signup form"
        className="mx-auto max-w-xl p-8"
      />
    ),
  }
);

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <SignupForm />
    </section>
  );
}
