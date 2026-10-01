import * as React from 'react';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { OrangeIcon } from '@hugeicons/core-free-icons';
import Link from 'next/link';

export interface BrandNameProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Link>,
  'children'
> {
  prefix?: string;
  suffix?: string;
  iconSize?: number;
}

const BrandName = React.forwardRef<HTMLAnchorElement, BrandNameProps>(
  ({ prefix = 'designL', suffix = 'p', iconSize = 12, href = '/', className, ...props }, ref) => {
    return (
      <Link
        href={href}
        ref={ref}
        className={cn(
          'inline-flex items-center font-space-heading font-bold leading-none',
          'text-base',
          className
        )}
        aria-label="DesignLoop"
        {...props}
      >
        <span>{prefix}</span>
        <span className="inline-flex items-center -gap-0.5" aria-hidden="true">
          <HugeiconsIcon
            icon={OrangeIcon}
            size={iconSize}
            strokeWidth={2.5}
            className="text-primary"
          />
          <HugeiconsIcon
            icon={OrangeIcon}
            size={iconSize}
            strokeWidth={2.5}
            className="text-primary"
          />
        </span>
        <span>{suffix}</span>
      </Link>
    );
  }
);

BrandName.displayName = 'BrandName';

export { BrandName };
