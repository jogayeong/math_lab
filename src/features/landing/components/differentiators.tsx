'use client';

import { ClipboardCheck, FileBarChart, UserCheck } from 'lucide-react';
import { DIFFERENTIATORS } from '@/features/landing/constants/content';
import { neonCardClassName } from '@/features/landing/constants/ui';
import { Reveal } from '@/features/landing/components/reveal';
import { SectionHeading, SectionShell } from '@/features/landing/components/section-shell';
import { cn } from '@/lib/utils';

const ICONS = [ClipboardCheck, FileBarChart, UserCheck] as const;

export function Differentiators() {
  return (
    <SectionShell id="differentiators">
      <SectionHeading
        eyebrow="SYSTEM"
        title="관리가 수업보다 먼저입니다"
        description="오답, 리포트, 등원을 한 사이클로 묶어 빈 주가 생기지 않게 합니다."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {DIFFERENTIATORS.map((item, index) => {
          const Icon = ICONS[index] ?? ClipboardCheck;

          return (
            <Reveal key={item.title} delay={index * 0.08}>
              <article className={cn(neonCardClassName, 'h-full p-6')}>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-500/15 text-secondary-400">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-100">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">{item.description}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
