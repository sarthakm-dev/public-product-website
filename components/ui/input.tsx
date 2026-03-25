import * as React from 'react';

import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400 shadow-inner outline-none transition focus-visible:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/30',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
