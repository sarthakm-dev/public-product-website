'use client';

import { useEffect, useId, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getErrorMessage, parseJsonSafely } from '@/lib/api';
import { composeAriaDescribedBy, scrollAndFocusElement } from '@/lib/aria';
import { apiRoutes } from '@/lib/routes';
import { newsletterSchema } from '@/lib/schemas';

export function NewsletterForm() {
  const emailId = useId();
  const hintId = `${emailId}-hint`;
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const getSuccessTitle = (message?: string) => {
    if (/already on the waitlist/i.test(message ?? '')) {
      return 'You are already on the waitlist';
    }

    return 'You are on the waitlist';
  };

  useEffect(() => {
    if (!error) {
      return;
    }

    scrollAndFocusElement(emailRef.current);
  }, [error]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message;
      setError(message ?? 'Invalid email');
      toast.error('Subscription failed', {
        description: message,
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(apiRoutes.subscribe, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed.data),
        });

        const data = await parseJsonSafely<{
          message?: string;
          error?: string;
        }>(response);

        if (!response.ok) {
          const message = data?.error ?? 'Subscription failed.';
          setError(message);
          toast.error('Subscription failed', {
            description: message,
          });
          return;
        }

        setEmail('');
        toast.success(getSuccessTitle(data?.message), {
          description: data?.message ?? 'Subscribed.',
        });
      } catch (error) {
        const message = getErrorMessage(error, 'Subscription failed.');
        setError(message);
        toast.error('Subscription failed', {
          description: message,
        });
      }
    });
  };

  return (
    <Card className="p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">
            Newsletter / Waitlist
          </p>
          <h3 className="text-2xl font-semibold text-white">
            Capture early adopters directly in Strapi
          </h3>
          <p className="max-w-xl text-sm leading-7 text-slate-300">
            This form submits client-side to <code>{apiRoutes.subscribe}</code>,
            validates email, stores the subscriber in Strapi, and surfaces
            success/error states.
          </p>
        </div>
      </div>

      <form
        className="mt-6 flex flex-col gap-4 md:flex-row"
        onSubmit={onSubmit}
        noValidate
      >
        <Input
          id={emailId}
          ref={emailRef}
          type="email"
          placeholder="Enter your work email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          aria-label="Work email"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={composeAriaDescribedBy(hintId)}
        />
        <Button type="submit" disabled={pending} aria-busy={pending}>
          {pending ? 'Submitting...' : 'Join Waitlist'}
        </Button>
      </form>

      <p id={hintId} className="mt-4 text-sm text-slate-300">
        Use a valid work email to join the waitlist.
      </p>
    </Card>
  );
}
