import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        aria-hidden="true"
      >
        <Skeleton className="h-4 w-24 bg-white/10" />
        <Skeleton className="mt-4 h-10 w-full bg-white/10" />
        <Skeleton className="mt-3 h-4 w-3/4 bg-white/10" />
        <span className="sr-only">Loading...</span>
      </div>
    </section>
  );
}
