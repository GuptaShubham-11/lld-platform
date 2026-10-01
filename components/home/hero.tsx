import { OrangeIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Container } from '../core/container';
import { HeroSkeleton } from './hero-skeleton';
import { Button } from '../ui/button';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative border-b border-l border-border bg-secondary rounded-lg pt-12 md:py-24 ml-4"
    >
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent px-2 rounded-sm text-sm">
        AI Agent Helps You Master Low-Level Design
      </span>

      <Container className="flex flex-col items-center justify-center">
        <h1 className="text-center text-4xl font-semibold leading-tight tracking-tight text-secondary-foreground sm:text-5xl lg:text-6xl">
          masterL
          <HugeiconsIcon
            icon={OrangeIcon}
            size={32}
            strokeWidth={2.5}
            className="inline-block align-middle text-primary"
          />
          wLevelDesign
        </h1>

        <p className="max-w-2xl text-center text-base leading-relaxed text-muted-foreground lg:text-lg text-balance mt-2">
          Solve real interview-style LLD problems, submit your design, and get instant AI feedback
          that helps you improve with every attempt.
        </p>

        <div className="flex items-center gap-4 mt-4">
          <Button size={'lg'} className="mt-4 font-space-heading ">
            Start Solving Problems
          </Button>
          <Button size={'lg'} variant={'outline'} className="mt-4 font-space-heading ">
            Browse Problems
          </Button>
        </div>
        <HeroSkeleton />
      </Container>
    </section>
  );
}
