'use client';

import { useSyncExternalStore } from 'react';
import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Returns false on server, true on client
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );

  return (
    <div className="flex items-center md:gap-1 rounded-full border border-white/10 bg-white/5 md:p-1">
      <Button
        type="button"
        variant={mounted && resolvedTheme === 'light' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('light')}
        aria-label="Switch to light mode"
      >
        <SunMedium className="size-4" />
      </Button>
      <Button
        type="button"
        variant={mounted && resolvedTheme === 'dark' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('dark')}
        aria-label="Switch to dark mode"
      >
        <MoonStar className="size-4" />
      </Button>
    </div>
  );
}
