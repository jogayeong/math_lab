'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LEVEL_QUESTIONS } from '@/features/landing/constants/content';
import { neonButtonClassName, neonCardClassName } from '@/features/landing/constants/ui';
import { SectionHeading, SectionShell } from '@/features/landing/components/section-shell';
import { formatLevelTestResult } from '@/features/landing/lib/diagnosis-result';
import { useDiagnosisResults } from '@/features/landing/hooks/use-diagnosis-results';
import {
  isLevelTestComplete,
  recommendCourse,
  type LevelAnswers,
  type LevelOption,
} from '@/features/landing/lib/level-test';
import { cn } from '@/lib/utils';

export function LevelTestWidget() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<LevelAnswers>({});

  const question = LEVEL_QUESTIONS[step];
  const isResultStep = step >= LEVEL_QUESTIONS.length;
  const setLevelTestResult = useDiagnosisResults((state) => state.setLevelTestResult);
  const result = useMemo(
    () => (isLevelTestComplete(answers) ? recommendCourse(answers) : null),
    [answers],
  );

  useEffect(() => {
    setLevelTestResult(result ? formatLevelTestResult(result) : '');
  }, [result, setLevelTestResult]);

  const selectOption = (option: LevelOption) => {
    if (!question) {
      return;
    }

    setDirection(1);
    setAnswers((current) => ({ ...current, [question.id]: option }));
    setStep((current) => (current === step ? Math.min(current + 1, LEVEL_QUESTIONS.length) : current));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((current) => Math.max(current - 1, 0));
  };

  const restart = () => {
    setDirection(-1);
    setAnswers({});
    setStep(0);
  };

  return (
    <SectionShell id="level-test">
      <SectionHeading
        eyebrow="LEVEL TEST"
        title="3분이면 끝나는 수준 진단"
        description="학년, 최근 성취도, 막히는 지점을 고르면 추천 코스가 바로 바뀝니다. 이전 문항으로 돌아가 답을 고치면 결과도 다시 계산됩니다."
      />

      <div className={cn(neonCardClassName, 'mx-auto max-w-3xl overflow-hidden p-6 md:p-8')}>
        <div className="mb-6 flex items-center justify-between gap-4 text-sm text-neutral-400">
          <p>{isResultStep ? '진단 결과' : `${step + 1} / ${LEVEL_QUESTIONS.length}`}</p>
          {result && !isResultStep ? (
            <p className="text-primary-400">추천 코스 갱신: {result.name}</p>
          ) : null}
        </div>

        <div className="mb-6 h-1 overflow-hidden rounded-full bg-neutral-700">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{
              width: `${(Math.min(step, LEVEL_QUESTIONS.length) / LEVEL_QUESTIONS.length) * 100}%`,
            }}
          />
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          {isResultStep && result ? (
            <motion.div
              key="result"
              custom={direction}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.28 }}
            >
              <p className="text-sm font-semibold tracking-[0.16em] text-accent-400">RECOMMENDED</p>
              <h3 className="mt-3 text-3xl font-bold text-primary-400">{result.name}</h3>
              <p className="mt-4 text-base leading-relaxed text-neutral-200">{result.summary}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {result.points.map((point) => (
                  <li
                    key={point}
                    className="rounded-xl border border-secondary-500/40 bg-secondary-500/10 px-3 py-3 text-sm text-neutral-100"
                  >
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className={neonButtonClassName}>
                  <a href="#reservation">이 코스로 상담 예약</a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 min-h-11 rounded-full border-neutral-600 bg-transparent text-neutral-100 hover:bg-neutral-800"
                  onClick={goBack}
                >
                  답변 수정
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-12 min-h-11 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
                  onClick={restart}
                >
                  다시 진단
                </Button>
              </div>
            </motion.div>
          ) : question ? (
            <motion.div
              key={question.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.28 }}
            >
              <h3 className="text-2xl font-semibold text-neutral-100">{question.prompt}</h3>
              <div className="mt-6 grid gap-3">
                {question.options.map((option) => {
                  const isSelected = answers[question.id]?.id === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => selectOption(option)}
                      className={cn(
                        'min-h-11 rounded-2xl border px-4 py-4 text-left text-base text-neutral-100 transition',
                        isSelected
                          ? 'border-primary-500 bg-primary-500/10 shadow-[0_0_20px_rgba(31,221,215,0.45)]'
                          : 'border-neutral-700 bg-neutral-900 hover:border-primary-500/60',
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-11 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
                  onClick={goBack}
                  disabled={step === 0}
                >
                  이전 문항
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}
