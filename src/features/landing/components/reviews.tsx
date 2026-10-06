'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useInterval } from 'react-use';
import { Button } from '@/components/ui/button';
import { REVIEWS } from '@/features/landing/constants/content';
import { neonCardClassName } from '@/features/landing/constants/ui';
import { SectionHeading, SectionShell } from '@/features/landing/components/section-shell';
import { cn } from '@/lib/utils';

export function Reviews() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const review = REVIEWS[index];

  useInterval(() => {
    setIndex((current) => (current + 1) % REVIEWS.length);
  }, isPaused ? null : 5000);

  const showPrevious = () => {
    setIndex((current) => (current - 1 + REVIEWS.length) % REVIEWS.length);
  };

  const showNext = () => {
    setIndex((current) => (current + 1) % REVIEWS.length);
  };

  if (!review) {
    return null;
  }

  return (
    <SectionShell id="reviews">
      <SectionHeading
        eyebrow="REVIEWS"
        title="성적 변화로 남긴 후기"
        description="학부모가 상담에서 가장 먼저 확인하는 관리의 결과를 카드로 모았습니다."
      />
      <div
        className="mx-auto max-w-3xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <article className={cn(neonCardClassName, 'p-8 md:p-10')} aria-live="polite">
          <p className="font-display text-5xl leading-none text-primary-500" aria-hidden="true">
            “
          </p>
          <blockquote className="mt-2 text-xl leading-relaxed text-neutral-100 md:text-2xl">
            {review.quote}
          </blockquote>
          <footer className="mt-8">
            <p className="font-semibold text-neutral-100">{review.name}</p>
            <p className="text-sm text-secondary-400">{review.meta}</p>
          </footer>
        </article>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">
            {index + 1} / {REVIEWS.length}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 border-primary-500/40 bg-transparent text-neutral-100 hover:bg-primary-500/10 hover:text-primary-400"
              onClick={showPrevious}
              aria-label="이전 후기"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 border-primary-500/40 bg-transparent text-neutral-100 hover:bg-primary-500/10 hover:text-primary-400"
              onClick={showNext}
              aria-label="다음 후기"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
