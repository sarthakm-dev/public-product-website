'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/lib/schemas';
import { FormValues } from '@/lib/types';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const submit = form.handleSubmit(values => {
    setError(null);

    startTransition(async () => {
      const result = await signIn('credentials', {
        ...values,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Check the Strapi user account.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    });
  });

  return (
    <Card className="mx-auto max-w-xl p-8">
      <div className="space-y-4">
        <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">
          Login
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Access your dashboard
        </h1>
      </div>

      <form className="mt-8 space-y-4" onSubmit={submit}>
        <div>
          <Input placeholder="Email" {...form.register('email')} />
          <p className="mt-2 text-sm text-rose-300">
            {form.formState.errors.email?.message}
          </p>
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            {...form.register('password')}
          />
          <p className="mt-2 text-sm text-rose-300">
            {form.formState.errors.password?.message}
          </p>
        </div>
        <Button className="w-full" type="submit" disabled={pending}>
          {pending ? 'Signing in...' : 'Sign in with Credentials'}
        </Button>
      </form>

      <Button
        className="mt-4 w-full"
        variant="secondary"
        onClick={() =>
          signIn('google', {
            callbackUrl: '/dashboard',
            prompt: 'select_account',
          })
        }
      >
        Continue with Google
      </Button>

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
    </Card>
  );
}
