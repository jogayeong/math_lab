'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HERO } from '@/features/landing/constants/content';
import { MemberGreeting } from '@/features/landing/components/member-greeting';
import { neonButtonClassName } from '@/features/landing/constants/ui';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

const hoverTransition = { duration: 0.5, ease: 'linear' } as const;

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const copyVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const smoothControlClassName =
  'transition-[color,background-color,border-color,box-shadow] duration-700 ease-out';

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);

  return (
    <section id="hero" className="scroll-mt-24 px-4 pb-16 pt-28 md:px-8 md:pt-32">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          variants={copyVariants}
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16, rotate: -8 },
              visible: {
                opacity: 1,
                y: 0,
                rotate: -2,
                transition: { duration: 0.7, ease: EASE },
              },
            }}
            className="inline-flex rounded-full border border-primary-500/60 bg-primary-500/10 px-3 py-1 font-display text-xs font-bold tracking-[0.18em] text-primary-400"
          >
            {HERO.eyebrow}
          </motion.p>
          <motion.div variants={riseVariants}>
            <MemberGreeting className="mt-4" />
          </motion.div>
          <motion.h1
            className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight text-neutral-100 md:text-6xl"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {HERO.title.map((line, index) => {
              const isAccent = index === HERO.title.length - 1;

              return (
                <motion.span
                  key={line}
                  className={isAccent ? 'block text-primary-500' : 'block'}
                  variants={riseVariants}
                >
                  {isAccent ? (
                    <motion.span
                      className="inline-block"
                      animate={
                        reduceMotion
                          ? undefined
                          : {
                              textShadow: [
                                '0 0 0px rgba(31,221,215,0)',
                                '0 0 22px rgba(31,221,215,0.7)',
                                '0 0 0px rgba(31,221,215,0)',
                              ],
                            }
                      }
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1.2,
                      }}
                    >
                      {line}
                    </motion.span>
                  ) : (
                    line
                  )}
                </motion.span>
              );
            })}
          </motion.h1>
          <motion.p
            variants={riseVariants}
            className="mt-6 max-w-xl text-base leading-relaxed text-neutral-400 md:text-lg"
          >
            {HERO.description}
          </motion.p>
          <motion.div variants={riseVariants} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.div
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              transition={hoverTransition}
            >
              <Button asChild className={cn(neonButtonClassName, smoothControlClassName)}>
                <a href="#reservation">상담 예약하기</a>
              </Button>
            </motion.div>
            <motion.div
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              transition={hoverTransition}
            >
              <Button
                asChild
                variant="outline"
                className={cn(
                  smoothControlClassName,
                  'h-12 min-h-11 rounded-full border-secondary-500/70 bg-transparent px-6 text-secondary-400 hover:border-secondary-400 hover:bg-secondary-500/10 hover:text-secondary-300 hover:shadow-[0_0_24px_rgba(6,182,212,0.4)]',
                )}
              >
                <a href="#level-test">레벨 진단하기</a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative"
          initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        >
          <motion.div
            aria-hidden
            className="absolute -inset-4 rounded-[2rem] bg-primary-500/25 blur-2xl"
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.35, 0.8, 0.35], scale: [0.96, 1.06, 0.96] }
            }
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="relative overflow-hidden rounded-[2rem] border border-primary-500/40"
            initial={false}
            animate={{ boxShadow: '0 0 18px rgba(31,221,215,0.32)' }}
            whileHover={
              reduceMotion
                ? undefined
                : { boxShadow: '0 0 36px rgba(31,221,215,0.58)', y: -4 }
            }
            transition={hoverTransition}
          >
            <motion.img
              src={HERO.image.src}
              alt={HERO.image.alt}
              width={1200}
              height={600}
              className="aspect-[2/1] w-full object-cover lg:aspect-[6/5]"
              whileHover={reduceMotion ? undefined : { scale: 1.045 }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
