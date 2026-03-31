import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex cursor-pointer shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
  {
    variants: {
      variant: {
        default:
          'bg-cyan-400 text-slate-950 shadow-[0_10px_30px_rgba(34,211,238,0.35)] hover:-translate-y-0.5 hover:bg-cyan-300 focus-visible:ring-cyan-300',
        outline:
          'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-slate-300',
        secondary:
          'border border-white/15 bg-white/5 text-white hover:bg-white/10 focus-visible:ring-white/30',
        ghost:
          'px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white focus-visible:ring-white/30',
        destructive:
          'bg-red-500 text-white shadow-[0_10px_30px_rgba(239,68,68,0.3)] hover:-translate-y-0.5 hover:bg-red-400 focus-visible:ring-red-300',
        link: 'text-cyan-300 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 py-3',
        xs: 'h-8 px-3 text-xs',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'size-11',
        'icon-xs': 'size-8',
        'icon-sm': 'size-9',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
