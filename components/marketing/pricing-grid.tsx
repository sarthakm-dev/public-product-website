import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { PricingPlan } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export function PricingGrid({ plans }: { plans: PricingPlan[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {plans.map(plan => (
        <Card
          key={plan.id}
          className={`p-8 ${
            plan.isPopular
              ? 'border-cyan-300/40 bg-cyan-400/10 shadow-[0_20px_80px_rgba(8,145,178,0.18)]'
              : ''
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
              {plan.isPopular ? (
                <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-medium text-cyan-200">
                  Most Popular
                </span>
              ) : null}
            </div>
            <p className="text-slate-300">{plan.description}</p>
            <div className="text-4xl font-semibold text-white">
              {formatCurrency(plan.price)}
              <span className="ml-2 text-base font-normal text-slate-400">
                / month
              </span>
            </div>
            <div className="space-y-3">
              {plan.features.map(feature => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="mt-1 size-4 text-cyan-400" />
                  <span className="text-sm leading-7 text-slate-200">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
            <Button className="w-full">
              {plan.ctaLabel ?? 'Start Free Crawl'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
