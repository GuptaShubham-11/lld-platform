import * as React from 'react';
import { cn } from '@/lib/utils';

type ContainerProps<T extends React.ElementType = 'div'> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

function Container<T extends React.ElementType = 'div'>({
  as,
  className,
  children,
  ...props
}: ContainerProps<T>) {
  const Comp: React.ElementType = as ?? 'div';

  return (
    <Comp className={cn('mx-auto w-full', className)} {...props}>
      {children}
    </Comp>
  );
}

export { Container };
