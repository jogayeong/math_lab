'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

type StatValueProps = {
  value: string;
  delay?: number;
};

type StatToken =
  | { kind: 'digit'; digit: number }
  | { kind: 'mark'; character: string };

/**
 * Splits a stat figure into rolling digits and static marks such as a decimal point.
 */
function tokenizeStatValue(value: string): StatToken[] {
  return [...value].map((character) => {
    if (character >= '0' && character <= '9') {
      return { kind: 'digit', digit: Number(character) };
    }

    return { kind: 'mark', character };
  });
}

function RollingDigit({ digit, delay }: { digit: number; delay: number }) {
  const windowRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(windowRef, { once: true, amount: 0.6 });

  return (
    <span ref={windowRef} className="inline-block h-[1em] overflow-hidden">
      <motion.span
        className="flex flex-col"
        initial={{ y: '0em' }}
        animate={{ y: isInView ? `-${digit}em` : '0em' }}
        transition={{ duration: 1.35, ease: EASE, delay }}
      >
        {DIGITS.map((rowDigit) => (
          <span key={rowDigit} className="flex h-[1em] items-end justify-center leading-none">
            {rowDigit}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * Rolls each digit into place and blooms a neon glow when the figure enters the viewport.
 */
export function StatValue({ value, delay = 0 }: StatValueProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <span className="tabular-nums">{value}</span>;
  }

  const tokens = tokenizeStatValue(value);

  return (
    <>
      <span className="sr-only">{value}</span>
      <motion.span
        aria-hidden="true"
        className="inline-flex items-end tabular-nums"
        initial={{ scale: 0.92, filter: 'drop-shadow(0 0 0px rgba(31,221,215,0))' }}
        whileInView={{
          scale: [0.92, 1.045, 1],
          filter: [
            'drop-shadow(0 0 0px rgba(31,221,215,0))',
            'drop-shadow(0 0 18px rgba(31,221,215,0.95))',
            'drop-shadow(0 0 8px rgba(31,221,215,0.4))',
          ],
        }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.55, delay, times: [0, 0.68, 1], ease: EASE }}
      >
        {tokens.map((token, index) => {
          if (token.kind === 'mark') {
            return (
              <span key={`mark-${index}`} className="inline-flex h-[1em] items-end leading-none">
                {token.character}
              </span>
            );
          }

          const digitPlace = tokens
            .slice(0, index)
            .filter((item) => item.kind === 'digit').length;

          return (
            <RollingDigit
              key={`digit-${index}`}
              digit={token.digit}
              delay={delay + digitPlace * 0.1}
            />
          );
        })}
      </motion.span>
    </>
  );
}
