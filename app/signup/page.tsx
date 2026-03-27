import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { SignupForm } from '@/components/auth/signup-form';
import { authOptions } from '@/lib/auth-options';

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
