'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Compass, HeartHandshake, RotateCcw, Target, Workflow } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SectionHeading, SectionShell } from '@/features/landing/components/section-shell';
import { useDiagnosisResults } from '@/features/landing/hooks/use-diagnosis-results';
import { formatStyleTestResult } from '@/features/landing/lib/diagnosis-result';
import { neonButtonClassName, neonCardClassName } from '@/features/landing/constants/ui';
import {
  getSimResult,
  isSimTestComplete,
  resolveSimType,
  SIM_TEST,
  type SimOptionValue,
  type SimAnswers,
  type SimTypeCode,
} from '@/features/landing/lib/sim-test';
import { cn } from '@/lib/utils';

const TYPE_MARKS: Record<SimTypeCode, { icon: typeof Workflow; tone: string }> = {
  TYPE_A: {
    icon: Workflow,
    tone: 'border-primary-500/40 bg-primary-500/10 text-primary-300',
  },
  TYPE_B: {
    icon: HeartHandshake,
    tone: 'border-secondary-500/40 bg-secondary-500/10 text-secondary-300',
  },
  TYPE_C: {
    icon: Target,
    tone: 'border-accent-500/40 bg-accent-500/10 text-accent-300',
  },
  TYPE_D: {
    icon: Compass,
    tone: 'border-neutral-500/50 bg-neutral-900 text-neutral-200',
  },
};

export function SimTest() {
  const [step, setStep] = useState(-1);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<SimAnswers>({});

  const question = SIM_TEST.questions[step];
  const isIntro = step < 0;
  const isResultStep = step >= SIM_TEST.questions.length;
  const setStyleTestResult = useDiagnosisResults((state) => state.setStyleTestResult);
  const result = useMemo(() => {
    if (!isSimTestComplete(answers)) {
      return null;
    }

    return getSimResult(resolveSimType(answers));
  }, [answers]);

  useEffect(() => {
    setStyleTestResult(result ? formatStyleTestResult(result) : '');
  }, [result, setStyleTestResult]);

  const selectOption = (optionValue: SimOptionValue) => {
    if (!question) {
      return;
    }

    setDirection(1);
    setAnswers((current) => ({ ...current, [question.id]: optionValue }));
    setStep((current) => (current === step ? Math.min(current + 1, SIM_TEST.questions.length) : current));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((current) => Math.max(current - 1, -1));
  };

  const restart = () => {
    setDirection(-1);
    setAnswers({});
    setStep(-1);
  };

  const progress = isIntro ? 0 : Math.min(step, SIM_TEST.questions.length) / SIM_TEST.questions.length;

  return (
    <SectionShell id="parent-style">
      <SectionHeading
        eyebrow="PARENT STYLE"
        title="자녀 학습 관여 스타일"
        description={`${SIM_TEST.target_audience}를 위한 10문항입니다. 시험 기간에 무엇을 챙기는지 고르면, 상담에서 다룰 주제가 유형과 함께 정리됩니다.`}
      />

      <div className={cn(neonCardClassName, 'mx-auto max-w-3xl overflow-hidden p-6 md:p-8')}>
        <div className="mb-6 flex items-center justify-between gap-4 text-sm text-neutral-400">
          <p>
            {isResultStep ? '유형 결과' : isIntro ? '10문항' : `${step + 1} / ${SIM_TEST.questions.length}`}
          </p>
          <p className={cn(isResultStep && 'text-primary-400')}>{isResultStep ? '완료' : '약 2분'}</p>
        </div>

        <div
          className="mb-6 h-1 overflow-hidden rounded-full bg-neutral-700"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={SIM_TEST.questions.length}
          aria-valuenow={isIntro ? 0 : Math.min(step, SIM_TEST.questions.length)}
          aria-label="학습 관여 스타일 진행"
        >
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          {isIntro ? (
            <motion.div
              key="intro"
              custom={direction}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.28 }}
            >
              <p className="text-sm font-semibold tracking-[0.16em] text-accent-400">4 TYPES</p>
              <h3 className="mt-3 text-2xl font-semibold text-neutral-100 md:text-3xl">
                우리 집은 어떤 방식으로 공부를 챙기고 있을까
              </h3>
              <p className="mt-4 text-base leading-relaxed text-neutral-300">
                정답은 없습니다. 평소 선택에 가까운 항목을 고르면 네 가지 스타일 중 하나로 모입니다.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {SIM_TEST.results.map((item) => {
                  const mark = TYPE_MARKS[item.type_code as SimTypeCode];
                  const Icon = mark.icon;

                  return (
                    <li
                      key={item.type_code}
                      className={cn('flex items-start gap-3 rounded-2xl border px-4 py-4', mark.tone)}
                    >
                      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                      <span className="text-sm font-medium leading-relaxed text-neutral-100">
                        {item.title}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <Button type="button" className={cn(neonButtonClassName, 'mt-8')} onClick={() => {
                setDirection(1);
                setStep(0);
              }}>
                테스트 시작
              </Button>
            </motion.div>
          ) : null}

          {!isIntro && !isResultStep && question ? (
            <motion.div
              key={question.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.28 }}
            >
              <h3 className="text-2xl font-semibold text-neutral-100">{question.question}</h3>
              <div className="mt-6 grid gap-3">
                {question.options.map((option) => {
                  const isSelected = answers[question.id] === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => selectOption(option.value as SimOptionValue)}
                      className={cn(
                        'min-h-11 rounded-2xl border px-4 py-4 text-left text-base text-neutral-100 transition',
                        isSelected
                          ? 'border-primary-500 bg-primary-500/10 shadow-[0_0_20px_rgba(31,221,215,0.45)]'
                          : 'border-neutral-700 bg-neutral-900 hover:border-primary-500/60',
                      )}
                    >
                      {option.text}
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
                >
                  {step === 0 ? '처음으로' : '이전 문항'}
                </Button>
              </div>
            </motion.div>
          ) : null}

          {isResultStep && result ? (
            <motion.div
              key="result"
              custom={direction}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.28 }}
            >
              <ResultPanel typeCode={result.type_code as SimTypeCode} onBack={goBack} onRestart={restart} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}

type ResultPanelProps = {
  typeCode: SimTypeCode;
  onBack: () => void;
  onRestart: () => void;
};

function ResultPanel({ typeCode, onBack, onRestart }: ResultPanelProps) {
  const result = getSimResult(typeCode);
  const mark = TYPE_MARKS[typeCode];
  const Icon = mark.icon;

  return (
    <div>
      <p className="text-sm font-semibold tracking-[0.16em] text-accent-400">YOUR STYLE</p>
      <div className="mt-4 flex items-start gap-3">
        <span className={cn('inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border', mark.tone)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="text-2xl font-bold leading-snug text-primary-400 md:text-3xl">{result.title}</h3>
      </div>
      <p className="mt-4 text-lg leading-relaxed text-neutral-100">{result.slogan}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {result.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-primary-500/40 bg-primary-500/10 px-3 py-1 text-xs text-primary-200"
          >
            #{tag}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-base leading-relaxed text-neutral-300">{result.description}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-secondary-500/40 bg-secondary-500/10 px-4 py-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-secondary-300">강점</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-100">{result.pros}</p>
        </div>
        <div className="rounded-xl border border-neutral-600 bg-neutral-900/80 px-4 py-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-neutral-400">유의점</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-200">{result.cons}</p>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-sm font-semibold text-neutral-100">상담에서 다루면 좋은 주제</p>
        <ol className="mt-3 grid gap-3">
          {result.recommended_consultation_topics.map((topic, index) => (
            <li
              key={topic}
              className="flex gap-3 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm leading-relaxed text-neutral-200"
            >
              <span className="font-display text-primary-400">{String(index + 1).padStart(2, '0')}</span>
              <span>{topic}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild className={neonButtonClassName}>
          <a href="#reservation">이 주제로 상담 예약</a>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 min-h-11 rounded-full border-neutral-600 bg-transparent text-neutral-100 hover:bg-neutral-800"
          onClick={onBack}
        >
          답변 수정
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-12 min-h-11 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
          onClick={onRestart}
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          다시 진단
        </Button>
      </div>
    </div>
  );
}
