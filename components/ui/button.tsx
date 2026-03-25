import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-cyan-400 px-5 py-3 text-slate-950 shadow-[0_10px_30px_rgba(34,211,238,0.35)] hover:-translate-y-0.5 hover:bg-cyan-300 focus-visible:ring-cyan-300',
        secondary:
          'border border-white/15 bg-white/5 px-5 py-3 text-white hover:bg-white/10 focus-visible:ring-white/30',
        ghost:
          'px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white focus-visible:ring-white/30',
        outline:
          'border border-slate-300 bg-white px-5 py-3 text-slate-900 hover:bg-slate-50 focus-visible:ring-slate-300',
      },
      size: {
        default: 'h-11',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
