'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/features/landing/components/reveal';

type SectionShellProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export function SectionShell({ id, children, className }: SectionShellProps) {
  return (
    <section id={id} className={cn('scroll-mt-24 px-4 py-20 md:px-8 md:py-28', className)}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Reveal className="mb-12 max-w-3xl">
      <p className="mb-3 font-display text-xs font-bold tracking-[0.22em] text-primary-500">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold tracking-tight text-neutral-100 md:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-relaxed text-neutral-400 md:text-lg">{description}</p>
    </Reveal>
  );
}
