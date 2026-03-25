'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SignUpFormValues } from '@/lib/types';
import { signupSchema } from '@/lib/schemas';

export function SignupForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const submit = form.handleSubmit(values => {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        setError(payload.error ?? 'Signup failed.');
        return;
      }

      setMessage(payload.message ?? 'Account created.');

      await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      router.push('/dashboard');
      router.refresh();
    });
  });

  return (
    <Card className="mx-auto max-w-xl p-8">
      <div className="space-y-4">
        <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">
          Sign Up
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Launch your first free accessibility crawl
        </h1>
      </div>

      <form className="mt-8 space-y-4" onSubmit={submit}>
        <div>
          <Input placeholder="Full name" {...form.register('name')} />
          <p className="mt-2 text-sm text-rose-300">
            {form.formState.errors.name?.message}
          </p>
        </div>
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
          {pending ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      {message ? <p className="mt-4 text-sm text-cyan-200">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
    </Card>
  );
}
