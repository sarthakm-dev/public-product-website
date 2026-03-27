'use client';

import { useId, useRef, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { composeAriaDescribedBy, scrollAndFocusElement } from '@/lib/aria';
import { getErrorMessage, parseJsonSafely } from '@/lib/api';
import { apiRoutes, pageRoutes } from '@/lib/routes';
import { SignUpFormValues } from '@/lib/types';
import { signupSchema } from '@/lib/schemas';
import Link from 'next/link';

export function SignupForm() {
  const router = useRouter();
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const [pending, startTransition] = useTransition();
  const fieldRefs = useRef<
    Partial<Record<keyof SignUpFormValues, HTMLInputElement | null>>
  >({});
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const nameField = form.register('name');
  const emailField = form.register('email');
  const passwordField = form.register('password');

  const submit = form.handleSubmit(values => {
    startTransition(async () => {
      try {
        const response = await fetch(apiRoutes.auth.register, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const payload = await parseJsonSafely<{
          error?: string;
          message?: string;
        }>(response);

        if (!response.ok) {
          toast.error('Signup failed', {
            description: payload?.error ?? 'Unable to create your account.',
          });
          return;
        }

        toast.success('Account created', {
          description: payload?.message ?? 'Your account is ready.',
        });

        const result = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error('Auto sign-in failed', {
            description:
              'Your account was created, but we could not sign you in automatically.',
          });
          router.push(pageRoutes.login);
          return;
        }

        router.push(pageRoutes.dashboard);
        router.refresh();
      } catch (error) {
        toast.error('Signup failed', {
          description: getErrorMessage(error),
        });
      }
    });
  });

  useEffect(() => {
    if (form.formState.submitCount === 0) {
      return;
    }

    const errors = form.formState.errors;
    const firstError = Object.keys(errors)[0] as
      | keyof SignUpFormValues
      | undefined;
    if (firstError) {
      scrollAndFocusElement(fieldRefs.current[firstError]);
    }
  }, [form.formState.errors, form.formState.submitCount]);

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

      <form className="mt-8 space-y-4" onSubmit={submit} noValidate>
        <div>
          <Input
            id={nameId}
            placeholder="Full name"
            {...nameField}
            ref={element => {
              nameField.ref(element);
              fieldRefs.current.name = element;
            }}
            aria-invalid={form.formState.errors.name ? 'true' : 'false'}
            aria-describedby={composeAriaDescribedBy(
              form.formState.errors.name && `${nameId}-error`
            )}
          />
          <p
            id={`${nameId}-error`}
            className="mt-2 text-sm text-rose-300"
            role={form.formState.errors.name ? 'alert' : undefined}
            aria-live="assertive"
          >
            {form.formState.errors.name?.message}
          </p>
        </div>
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
          {pending ? 'Creating account...' : 'Create Account'}
        </Button>
        <p className="mt-6 text-sm text-slate-400 text-center">
          Already have an account?{' '}
          <Link
            href={pageRoutes.login}
            className="text-cyan-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </Card>
  );
}
