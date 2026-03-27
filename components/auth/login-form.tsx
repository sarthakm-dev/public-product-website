'use client';

import { useEffect, useId, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { composeAriaDescribedBy, scrollAndFocusElement } from '@/lib/aria';
import { loginSchema } from '@/lib/schemas';
import { pageRoutes } from '@/lib/routes';
import { FormValues } from '@/lib/types';
import { getErrorMessage } from '@/lib/api';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const [pending, startTransition] = useTransition();
  const fieldRefs = useRef<
    Partial<Record<keyof FormValues, HTMLInputElement | null>>
  >({});
  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const emailField = form.register('email');
  const passwordField = form.register('password');

  useEffect(() => {
    if (form.formState.submitCount === 0) {
      return;
    }

    const errors = form.formState.errors;
    const firstError = Object.keys(errors)[0] as keyof FormValues | undefined;
    if (firstError) {
      scrollAndFocusElement(fieldRefs.current[firstError]);
    }
  }, [form.formState.errors, form.formState.submitCount]);

  const submit = form.handleSubmit(values => {
    startTransition(async () => {
      try {
        const result = await signIn('credentials', {
          ...values,
          redirect: false,
        });

        if (result?.error) {
          toast.error('Sign-in failed', {
            description: 'Invalid credentials. Check the Strapi user account.',
          });
          return;
        }

        router.push(pageRoutes.dashboard);
        router.refresh();
      } catch (error) {
        toast.error('Unable to sign in', {
          description: getErrorMessage(error),
        });
      }
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

      <form className="mt-8 space-y-4" onSubmit={submit} noValidate>
        <div>
          <Input
            id={emailId}
            placeholder="Email"
            {...emailField}
            ref={element => {
              emailField.ref(element);
              fieldRefs.current.email = element;
            }}
            aria-invalid={form.formState.errors.email ? 'true' : 'false'}
            aria-describedby={composeAriaDescribedBy(
              form.formState.errors.email && `${emailId}-error`
            )}
          />
          <p
            id={`${emailId}-error`}
            className="mt-2 text-sm text-rose-300"
            role={form.formState.errors.email ? 'alert' : undefined}
            aria-live="assertive"
          >
            {form.formState.errors.email?.message}
          </p>
        </div>
        <div>
          <Input
            id={passwordId}
            type="password"
            placeholder="Password"
            {...passwordField}
            ref={element => {
              passwordField.ref(element);
              fieldRefs.current.password = element;
            }}
            aria-invalid={form.formState.errors.password ? 'true' : 'false'}
            aria-describedby={composeAriaDescribedBy(
              form.formState.errors.password && `${passwordId}-error`
            )}
          />
          <p
            id={`${passwordId}-error`}
            className="mt-2 text-sm text-rose-300"
            role={form.formState.errors.password ? 'alert' : undefined}
            aria-live="assertive"
          >
            {form.formState.errors.password?.message}
          </p>
        </div>
        <Button
          className="w-full"
          type="submit"
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? 'Signing in...' : 'Sign in with Credentials'}
        </Button>
      </form>

      <Button
        className="mt-4 w-full"
        variant="secondary"
        onClick={() =>
          signIn('google', {
            callbackUrl: pageRoutes.dashboard,
            prompt: 'select_account',
          })
        }
      >
        Continue with Google
      </Button>
      <p className="mt-6 text-center text-sm text-slate-400">
        Dont have an account?{' '}
        <Link
          href={pageRoutes.signup}
          className="text-cyan-400 hover:underline"
        >
          Signup
        </Link>
      </p>
    </Card>
  );
}
