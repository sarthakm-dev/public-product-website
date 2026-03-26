import {
  Accessibility,
  Activity,
  BadgeCheck,
  FileCheck2,
  SearchCode,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import type { FeatureItem } from '@/lib/types';

const iconMap = {
  search: SearchCode,
  score: Accessibility,
  report: FileCheck2,
  compliance: BadgeCheck,
  monitoring: Activity,
};

export function FeatureGrid({ features }: { features: FeatureItem[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {features.map(feature => {
        const Icon =
          iconMap[feature.icon as keyof typeof iconMap] ?? SearchCode;

        return (
          <Card
            key={feature.id}
            className="p-6 transition hover:-translate-y-1"
          >
            <div className="mb-5 inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-400">
              <Icon className="size-5" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              {feature.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {feature.description}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
