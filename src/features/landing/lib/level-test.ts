import { sumBy } from 'es-toolkit';
import { match, P } from 'ts-pattern';
import { COURSES, LEVEL_QUESTIONS } from '@/features/landing/constants/content';

export type LevelOption = {
  id: string;
  label: string;
  score: number;
};

export type LevelAnswers = Record<string, LevelOption>;

/**
 * 추천 코스는 학년보다 성취도와 막히는 지점의 가중치가 더 커야 해서
 * 문항 점수를 합산한 뒤 구간으로만 나눈다.
 */
export function recommendCourse(answers: LevelAnswers) {
  const score = sumBy(LEVEL_QUESTIONS, (question) => answers[question.id]?.score ?? 0);

  return match(score)
    .with(P.when((value) => value >= 12), () => COURSES.killer)
    .with(P.when((value) => value >= 8), () => COURSES.advanced)
    .with(P.when((value) => value >= 4), () => COURSES.school)
    .otherwise(() => COURSES.foundation);
}

export function isLevelTestComplete(answers: LevelAnswers) {
  return LEVEL_QUESTIONS.every((question) => Boolean(answers[question.id]));
}
