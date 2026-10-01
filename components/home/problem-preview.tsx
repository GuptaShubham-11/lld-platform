import { cn } from '@/lib/utils';

export function ProblemPreview() {
  return (
    <div className={cn('flex h-auto flex-col gap-2 p-2', 'md:gap-4')}>
      <div className="max-w-lg">
        <h2 className="font-space-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
          Design a Vending Machine
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground md:mt-4">
          Design a thread-safe vending machine that manages product inventory, accepts and validates
          multiple coin denominations, tracks user balance, handles item selection and dispensing,
          and safely processes concurrent transactions without inconsistent inventory or payment
          state.
        </p>
      </div>

      {/* Requirements */}
      <div className="flex flex-wrap items-center gap-2">
        {['Thread-safe', 'Coin handling', 'Inventory', 'Item dispensing'].map((item) => (
          <span
            key={item}
            className="rounded-md border border-border/70 bg-background px-2 py-1.5 text-xs font-medium text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between gap-2 md:justify-end">
        <span className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Medium
        </span>

        <span className="text-xs text-muted-foreground">45 min</span>
      </div>
    </div>
  );
}
