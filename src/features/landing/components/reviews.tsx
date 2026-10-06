'use client';

import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useInterval } from 'react-use';
import { Button } from '@/components/ui/button';
import { REVIEWS } from '@/features/landing/constants/content';
import { hoverLinearClassName, neonCardClassName } from '@/features/landing/constants/ui';
import { SectionHeading, SectionShell } from '@/features/landing/components/section-shell';
import { cn } from '@/lib/utils';

const TEXT_EASE = [0.22, 1, 0.36, 1] as const;

const contentVariants: Variants = {
  enter: (direction: number) => ({
    x: direction * 28,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: TEXT_EASE,
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
  exit: (direction: number) => ({
    x: direction * -20,
    opacity: 0,
    transition: { duration: 0.22, ease: 'linear' },
  }),
};

const fadeContentVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const lineVariants: Variants = {
  enter: { opacity: 0, y: 14, filter: 'blur(8px)' },
  center: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: TEXT_EASE },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.16, ease: 'linear' },
  },
};

type Review = (typeof REVIEWS)[number];

function ReviewCopy({
  review,
  animate,
}: {
  review: Review;
  animate: boolean;
}) {
  const Quote = animate ? motion.blockquote : 'blockquote';
  const Footer = animate ? motion.footer : 'footer';

  return (
    <>
      <Quote
        className="text-xl leading-relaxed text-neutral-100 md:text-2xl"
        {...(animate ? { variants: lineVariants } : {})}
      >
        {review.quote}
      </Quote>
      <Footer className="mt-8" {...(animate ? { variants: lineVariants } : {})}>
        <p className="font-semibold text-neutral-100">{review.name}</p>
        <p className="text-sm text-secondary-400">{review.meta}</p>
      </Footer>
    </>
  );
}

export function Reviews() {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);
  const [[index, direction], setSlide] = useState([0, 1]);
  const [isPaused, setIsPaused] = useState(false);
  const review = REVIEWS[index];

  const paginate = (newDirection: number) => {
    setSlide(([current]) => [
      (current + newDirection + REVIEWS.length) % REVIEWS.length,
      newDirection,
    ]);
  };

  useInterval(() => {
    paginate(1);
  }, isPaused ? null : 5000);

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
        <article className={cn(neonCardClassName, 'overflow-hidden p-8 md:p-10')} aria-live="polite">
          <p className="font-display text-5xl leading-none text-primary-500" aria-hidden="true">
            “
          </p>
          <div className="relative mt-2 overflow-hidden">
            <div className="invisible">
              <ReviewCopy review={review} animate={false} />
            </div>
            <AnimatePresence custom={direction} initial={false} mode="wait">
              <motion.div
                key={index}
                custom={direction}
                variants={reduceMotion ? fadeContentVariants : contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={reduceMotion ? { duration: 0.2, ease: 'linear' } : undefined}
                className="absolute inset-x-0 top-0"
              >
                <ReviewCopy review={review} animate={!reduceMotion} />
              </motion.div>
            </AnimatePresence>
          </div>
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
              className={cn(
                hoverLinearClassName,
                'h-11 w-11 border-primary-500/40 bg-transparent text-neutral-100 hover:bg-primary-500/10 hover:text-primary-400',
              )}
              onClick={() => paginate(-1)}
              aria-label="이전 후기"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={cn(
                hoverLinearClassName,
                'h-11 w-11 border-primary-500/40 bg-transparent text-neutral-100 hover:bg-primary-500/10 hover:text-primary-400',
              )}
              onClick={() => paginate(1)}
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
