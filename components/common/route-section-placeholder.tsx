import { Card } from '@/components/ui/card';
import { RouteSectionPlaceholderProps } from '@/lib/types';

export function RouteSectionPlaceholder({
  label,
  title = 'Loading section...',
  lines = 3,
  className,
}: RouteSectionPlaceholderProps) {
  return (
    <Card className={className ?? 'p-8'}>
      <div className="animate-pulse space-y-4" aria-hidden="true">
        <div className="h-3 w-28 rounded-full bg-cyan-400/30" />
        <div className="h-8 w-full max-w-md rounded-full bg-white/10" />
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={`${label}-${index}`}
              className="h-4 rounded-full bg-white/10"
              style={{
                width: `${Math.max(55, 100 - index * 12)}%`,
              }}
            />
          ))}
        </div>
      </div>
      <span className="sr-only">{title}</span>
    </Card>
  );
}
