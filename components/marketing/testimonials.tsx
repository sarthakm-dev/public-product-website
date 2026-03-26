import { Card } from '@/components/ui/card';
import type { QuoteItem, UseCaseItem } from '@/lib/types';

export function Testimonials({
  testimonials,
  useCases,
}: {
  testimonials: QuoteItem[];
  useCases: UseCaseItem[];
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="grid gap-5 md:grid-cols-2">
        {testimonials.map(item => (
          <Card key={`${item.author}-${item.role}`} className="p-6">
            <p className="text-lg leading-8 text-white">“{item.quote}”</p>
            <div className="mt-5">
              <p className="font-medium text-cyan-400">{item.author}</p>
              <p className="text-sm text-slate-400">{item.role}</p>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">
          Use Cases
        </p>
        <div className="mt-5 space-y-4">
          {useCases.map(item => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-slate-950/50 p-5"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
