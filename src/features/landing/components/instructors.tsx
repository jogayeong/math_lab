'use client';

import { INSTRUCTORS } from '@/features/landing/constants/content';
import { neonCardClassName } from '@/features/landing/constants/ui';
import { Reveal } from '@/features/landing/components/reveal';
import { SectionHeading, SectionShell } from '@/features/landing/components/section-shell';
import { cn } from '@/lib/utils';

export function Instructors() {
  return (
    <SectionShell id="instructors">
      <SectionHeading
        eyebrow="INSTRUCTORS"
        title="문항을 분해하는 강사진"
        description="약력보다 수업에서 어디를 멈추게 하는지, 그 노하우를 먼저 보여 드립니다."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {INSTRUCTORS.map((instructor, index) => (
          <Reveal key={instructor.name} delay={index * 0.08}>
            <article className={cn(neonCardClassName, 'group h-full overflow-hidden p-0')}>
              <img
                src={instructor.image}
                alt={`${instructor.name} 강사 프로필`}
                width={400}
                height={400}
                className="aspect-square w-full object-cover transition-transform duration-500 ease-linear group-hover:scale-105"
              />
              <div className="space-y-2 p-6">
                <p className="text-sm font-medium text-accent-400">{instructor.subject}</p>
                <h3 className="text-2xl font-semibold text-neutral-100">{instructor.name}</h3>
                <p className="text-sm text-secondary-400">{instructor.career}</p>
                <p className="text-sm leading-relaxed text-neutral-400">{instructor.detail}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
