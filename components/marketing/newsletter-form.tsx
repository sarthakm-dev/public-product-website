'use client';

import { useState, useTransition } from 'react';

import { useToast } from '@/components/common/toast-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getErrorMessage, parseJsonSafely } from '@/lib/api';
import { newsletterSchema } from '@/lib/schemas';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid email');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/subscribe', {
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
          toast({
            variant: 'error',
            title: 'Subscription failed',
            description: message,
          });
          return;
        }

        setEmail('');
        toast({
          variant: 'success',
          title: 'You are on the waitlist',
          description: data?.message ?? 'Subscribed.',
        });
      } catch (error) {
        const message = getErrorMessage(error, 'Subscription failed.');
        setError(message);
        toast({
          variant: 'error',
          title: 'Subscription failed',
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
            This form submits client-side to `/api/subscribe`, validates email,
            stores the subscriber in Strapi, and surfaces success/error states.
          </p>
        </div>
      </div>

      <form
        className="mt-6 flex flex-col gap-4 md:flex-row"
        onSubmit={onSubmit}
      >
        <Input
          type="email"
          placeholder="Enter your work email"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
        <Button type="submit" disabled={pending}>
          {pending ? 'Submitting...' : 'Join Waitlist'}
        </Button>
      </form>

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
    </Card>
  );
}
