import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 backdrop-blur-xl">
        <LoaderCircle className="size-4 animate-spin text-cyan-400" />
        <span>Loading...</span>
      </div>
    </section>
  );
}
