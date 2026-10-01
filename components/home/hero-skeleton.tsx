import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ApiIcon,
  DatabaseIcon,
  Recycle02Icon,
  StrategyIcon,
  StructureCheckIcon,
  ThreeDScaleIcon,
} from '@hugeicons/core-free-icons';

interface HeroPoint {
  top: string;
  left: string;
  primary: boolean;
  label: string;
  icon: typeof ApiIcon;
}

const points: HeroPoint[] = [
  { top: '24%', left: '16%', primary: false, label: 'Interface', icon: ApiIcon },
  { top: '16%', left: '48%', primary: true, label: 'Models', icon: ThreeDScaleIcon },
  { top: '26%', left: '78%', primary: false, label: 'Structure', icon: StructureCheckIcon },
  { top: '56%', left: '22%', primary: false, label: 'Reusability', icon: Recycle02Icon },
  { top: '58%', left: '72%', primary: true, label: 'Strategy', icon: StrategyIcon },
  { top: '78%', left: '48%', primary: false, label: 'Database', icon: DatabaseIcon },
];

export const HeroSkeleton = () => {
  return (
    <div className="mx-auto relative aspect-square w-full max-w-md" aria-hidden="true">
      <svg viewBox="0 0 400 400" className="h-full w-full text-muted-foreground" fill="none">
        <path
          d="M80 100 L200 60 L320 110 M200 60 L200 180 M80 100 L120 220 M320 110 L280 240 M120 220 L200 180 L280 240 M120 220 L200 320 L280 240"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      {points.map((n) => (
        <span
          key={n.label}
          style={{ top: n.top, left: n.left }}
          className={cn(
            'absolute inline-flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium shadow-sm bg-muted text-muted-foreground hover:outline hover:outline-offset-1 hover:outline-primary',
            n.primary && 'border-primary/30'
          )}
        >
          <HugeiconsIcon icon={n.icon} size={14} className="text-foreground" />
          {n.label}
        </span>
      ))}
    </div>
  );
};
