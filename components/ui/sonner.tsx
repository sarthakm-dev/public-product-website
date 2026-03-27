'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

export function Toaster(props: ToasterProps) {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      richColors
      closeButton
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:border-white/10 group-[.toaster]:bg-slate-900 group-[.toaster]:text-white group-[.toaster]:shadow-2xl',
          description: 'group-[.toast]:text-slate-300',
          actionButton:
            'group-[.toast]:bg-cyan-400 group-[.toast]:text-slate-950',
          cancelButton: 'group-[.toast]:bg-white/10 group-[.toast]:text-white',
        },
      }}
      {...props}
    />
  );
}
