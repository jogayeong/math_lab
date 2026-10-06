'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { neonCardClassName } from '@/features/landing/constants/ui';
import { cn } from '@/lib/utils';

type AuthScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthScreen({ eyebrow, title, description, children }: AuthScreenProps) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-neutral-900 text-neutral-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-secondary-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-16 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-extrabold tracking-[0.18em] text-primary-500"
        >
          MATH.LAB
        </Link>
        <p className="mt-8 font-display text-xs font-bold tracking-[0.22em] text-primary-500">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-100 md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-neutral-400">{description}</p>

        <div
          className={cn(
            neonCardClassName,
            'mt-8 p-6 hover:translate-y-0 hover:shadow-[inset_0_0_0_1px_rgba(31,221,215,0.08),0_0_24px_0_rgba(31,221,215,0.28)] md:p-8',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
