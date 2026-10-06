'use client';

import { STATS } from '@/features/landing/constants/content';
import { neonCardClassName } from '@/features/landing/constants/ui';
import { Reveal } from '@/features/landing/components/reveal';
import { SectionHeading, SectionShell } from '@/features/landing/components/section-shell';
import { StatValue } from '@/features/landing/components/stat-value';
import { cn } from '@/lib/utils';

export function Stats() {
  return (
    <SectionShell id="stats">
      <SectionHeading
        eyebrow="RESULTS"
        title="숫자로 먼저 확인하는 실적"
        description="성적 변화, 입시 결과, 재원 만족도를 같은 기준으로 공개합니다."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {STATS.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.08}>
            <article className={cn(neonCardClassName, 'h-full p-6')}>
              <p className="flex items-end font-display text-5xl font-extrabold leading-none text-primary-500 md:text-6xl">
                <StatValue value={stat.value} delay={0.12 + index * 0.1} />
                <span className="mb-[0.12em] ml-1 text-2xl leading-none text-secondary-400">
                  {stat.unit}
                </span>
              </p>
              <h3 className="mt-4 text-xl font-semibold text-neutral-100">{stat.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{stat.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
