'use client';

import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Container } from '../core/container';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { FeedbackPreview } from './feedback-preview';
import { EditorPreview } from './editor-preview';
import { ProblemPreview } from './problem-preview';

const steps = [
  {
    number: '01',
    title: 'Choose a problem',
    description:
      'Design a thread-safe Vending Machine that accepts coins, dispenses items, and handles inventory tracking.',
    preview: 'problem',
  },
  {
    number: '02',
    title: 'Design your solution',
    description:
      'Draft your solution using structured code, quick skeleton outlines, or plain human-language logic directly inside the editor.',
    preview: 'editor',
  },
  {
    number: '03',
    title: 'Get instant feedback',
    description:
      'Receive actionable AI feedback on scalability, rubric scoring, trade-offs, SOLID principles, and design patterns.',
    preview: 'feedback',
  },
] as const;

type PreviewKind = (typeof steps)[number]['preview'];

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 40 : -40,
    scale: 0.97,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -40 : 40,
    scale: 0.97,
  }),
};

const springTransition = {
  type: 'spring' as const,
  stiffness: 350,
  damping: 28,
  mass: 0.8,
};

export function HowItWorks() {
  const [active, setActive] = React.useState(0);
  const [autoplay, setAutoplay] = React.useState(true);
  const [direction, setDirection] = React.useState(0);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (!autoplay || reducedMotion) return;

    const timer = window.setInterval(() => {
      setDirection(1);
      setActive((current) => (current + 1) % steps.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [autoplay, reducedMotion]);

  const handleSelect = (index: number) => {
    setAutoplay(false);
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  return (
    <section id="how-it-works" className="px-2 sm:px-12 py-12 sm:py-24">
      <Container>
        <div>
          <h2 className="font-space-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From good to better design.
          </h2>

          <p className="mt-4 text-sm max-w-2xl leading-6 text-muted-foreground sm:text-base text-balance">
            Practice realistic low-level design problems and improve through an automated ai
            pipeline. Receive actionable, focused ai feedback.
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(420px,1.1fr)_minmax(0,0.9fr)] lg:gap-16 mt-8">
          <Card className="relative mx-auto w-full overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                practice.designloop
              </CardTitle>
            </CardHeader>

            <CardContent className="-m-(--card-spacing)">
              <div className="relative min-h-72 bg-muted overflow-hidden">
                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.div
                    key={active}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={reducedMotion ? { duration: 0 } : springTransition}
                    className="absolute inset-0 p-4 sm:p-8"
                  >
                    <Preview kind={steps[active].preview} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </CardContent>

            <CardFooter className="border-t justify-end">
              <Button variant="ghost" className="cursor-pointer">
                Pick a problem and start for free
              </Button>
            </CardFooter>
          </Card>

          {/* Steps */}
          <div className="relative">
            <div className="absolute bottom-8 left-4.75 top-8 w-px bg-border sm:block" />

            <motion.div
              className="absolute left-4.75 top-8 w-px bg-accent sm:block"
              initial={false}
              animate={{
                height: `${(active / (steps.length - 1)) * 100}%`,
              }}
              transition={reducedMotion ? { duration: 0 } : springTransition}
            />

            <ol className="space-y-2 sm:space-y-0">
              {steps.map((step, index) => {
                const isActive = index === active;

                return (
                  <li key={step.number}>
                    <button
                      type="button"
                      onClick={() => handleSelect(index)}
                      aria-current={isActive ? 'step' : undefined}
                      className="group relative flex w-full gap-4 rounded-xl p-4 text-left transition-colors hover:bg-muted/40 sm:gap-5 sm:rounded-none sm:p-4 sm:pl-0"
                    >
                      {/* Number */}
                      <motion.span
                        className={cn(
                          'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-geist-mono font-bold',
                          isActive
                            ? 'border-accent bg-accent text-accent-foreground shadow-[0_0_0_5px_hsl(var(--accent)/0.08)]'
                            : 'border-border bg-background text-muted-foreground group-hover:border-foreground group-hover:text-foreground'
                        )}
                        initial={false}
                        animate={{
                          scale: isActive ? 1.08 : 1,
                        }}
                        transition={reducedMotion ? { duration: 0 } : springTransition}
                      >
                        {step.number}
                      </motion.span>

                      {/* Content */}
                      <span className="min-w-0 flex-1 pt-0.5">
                        <motion.span
                          className={cn(
                            'block text-sm font-semibold sm:text-base',
                            isActive
                              ? 'text-foreground'
                              : 'text-muted-foreground group-hover:text-foreground'
                          )}
                          initial={false}
                          animate={{
                            x: isActive ? 4 : 0,
                          }}
                          transition={
                            reducedMotion
                              ? {
                                  duration: 0,
                                }
                              : springTransition
                          }
                        >
                          {step.title}
                        </motion.span>

                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.span
                              initial={{
                                height: 0,
                                opacity: 0,
                                y: -6,
                              }}
                              animate={{
                                height: 'auto',
                                opacity: 1,
                                y: 0,
                              }}
                              exit={{
                                height: 0,
                                opacity: 0,
                                y: -6,
                              }}
                              transition={{
                                duration: 0.32,
                                ease: [0.25, 0.46, 0.45, 0.94],
                              }}
                              className="mt-1 block max-w-md overflow-hidden text-sm leading-6 text-muted-foreground"
                            >
                              {step.description}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Mobile step indicator */}
          <div className="mt-8 flex justify-center gap-1.5 sm:hidden">
            {steps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => handleSelect(index)}
                aria-label={`Go to step ${index + 1}`}
                className={cn(
                  'h-1 rounded-full transition-all duration-300',
                  index === active ? 'w-8 bg-accent' : 'w-2 bg-border'
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Preview({ kind }: { kind: PreviewKind }) {
  switch (kind) {
    case 'problem':
      return <ProblemPreview />;

    case 'editor':
      return <EditorPreview />;

    case 'feedback':
      return <FeedbackPreview />;
  }
}
