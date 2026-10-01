// components/sections/pricing.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const lineItems = [
  { label: 'Unlimited practice problems', price: 0 },
  { label: 'AI design critique', price: 0 },
  { label: 'Class diagram + code editor', price: 0 },
  { label: 'Attempt history', price: 0 },
  { label: "Founder's tax", price: 0 },
];

export function Pricing() {
  const [printed, setPrinted] = React.useState(0);

  React.useEffect(() => {
    if (printed >= lineItems.length) return;
    const t = setTimeout(() => setPrinted((n) => n + 1), 260);
    return () => clearTimeout(t);
  }, [printed]);

  return (
    <section id="pricing">
      <div className="container mx-auto">
        <div className="mx-auto mb-4 max-w-lg text-center">
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground font-space-heading sm:text-4xl">
            Here&apos;s your free plan
          </h2>
        </div>

        <div className="mx-auto max-w-sm">
          <Receipt printed={printed} />
        </div>
      </div>
    </section>
  );
}

function Receipt({ printed }: { printed: number }) {
  const total = lineItems.slice(0, printed).reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="relative">
      {/* paper */}
      <div className="relative  border border-t-0 border-b-0 border-border bg-secondary px-8 pb-6 pt-8">
        {/* line items */}
        <ul className="mb-5 flex flex-col gap-2.5">
          {lineItems.map((item, i) => (
            <li
              key={item.label}
              className={cn(
                'flex items-baseline justify-between text-[13px] transition-all duration-300',
                i < printed ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
              )}
            >
              <span className="text-foreground/80">{item.label}</span>
              <span className="shrink-0 pl-2 text-muted-foreground">
                <span className="mr-1 border-b border-dotted border-border" />
                $0.00
              </span>
            </li>
          ))}
        </ul>

        {/* total */}
        <div className="flex items-baseline justify-between border-t border-dashed border-border pt-2">
          <span className="text-sm font-semibold tracking-wide text-foreground">Total due</span>
          <span className="text-lg font-semibold tabular-nums">${total.toFixed(2)}</span>
        </div>

        <div className="mt-6 flex justify-center">
          <Button size="lg" className="w-full">
            Start Practice — $0.00
          </Button>
        </div>

        {/* barcode */}
        <div
          className="mx-auto mt-6 h-8 w-4/5 opacity-70"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, currentColor 0px, currentColor 2px, transparent 2px, transparent 5px, currentColor 5px, currentColor 6px, transparent 6px, transparent 10px)',
          }}
        />
      </div>
    </div>
  );
}
