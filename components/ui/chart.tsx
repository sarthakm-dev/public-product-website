'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '@/lib/utils';

export type ChartConfig = {
  [key: string]: {
    label?: string;
    color?: string;
  };
};

export function ChartContainer({
  id,
  className,
  children,
  config,
  minHeight = 240,
  minWidth = 0,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  minHeight?: number;
  minWidth?: number;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children'];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`;
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [hasValidSize, setHasValidSize] = React.useState(false);

  React.useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const updateSize = () => {
      const { width, height } = element.getBoundingClientRect();
      setHasValidSize(width > 0 && height > 0);
    };

    updateSize();

    if (typeof ResizeObserver === 'undefined') {
      setHasValidSize(true);
      return;
    }

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-chart={chartId}
      className={cn('h-60 w-full min-w-0', className)}
      {...props}
    >
      <ChartStyle id={chartId} config={config} />
      {hasValidSize ? (
        <RechartsPrimitive.ResponsiveContainer
          width="100%"
          height={300}
          minWidth={minWidth}
          minHeight={minHeight}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      ) : null}
    </div>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorEntries = Object.entries(config).filter(
    ([, value]) => value.color
  );

  if (colorEntries.length === 0) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: colorEntries
          .map(
            ([key, value]) =>
              `[data-chart="${id}"] { --color-${key}: ${value.color}; }`
          )
          .join('\n'),
      }}
    />
  );
}

export const ChartTooltip = RechartsPrimitive.Tooltip;
