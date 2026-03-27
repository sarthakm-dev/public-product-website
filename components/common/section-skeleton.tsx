import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionSkeletonProps } from '@/lib/types';

export function SectionSkeleton({
  label,
  title = 'Loading section...',
  lines = 3,
  className,
}: SectionSkeletonProps) {
  return (
    <Card className={className ?? 'p-8'}>
      <div className="space-y-4" aria-hidden="true">
        <Skeleton className="h-3 w-28 rounded-full bg-cyan-400/30" />
        <Skeleton className="h-8 w-full max-w-md rounded-full bg-white/10" />
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
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
