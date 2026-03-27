'use client';

import { signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { pageRoutes } from '@/lib/routes';

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="hover:shadow"
      onClick={() => signOut({ callbackUrl: pageRoutes.home })}
    >
      Logout
    </Button>
  );
}
