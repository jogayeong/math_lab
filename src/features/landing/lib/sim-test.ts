import { sumBy } from 'es-toolkit';
import { match } from 'ts-pattern';
import simTestData from '@/features/landing/components/simtest.json';

export const SIM_TEST = simTestData;

export type SimOptionValue = 'A' | 'B' | 'C';
export type SimTypeCode = 'TYPE_A' | 'TYPE_B' | 'TYPE_C' | 'TYPE_D';
export type SimAnswers = Partial<Record<number, SimOptionValue>>;

type ScoreCell = Partial<Record<SimTypeCode, number>>;

const TYPE_CODES: SimTypeCode[] = ['TYPE_A', 'TYPE_B', 'TYPE_C', 'TYPE_D'];

const scoreTable = SIM_TEST.scoring_algorithm.score_table as Record<
  string,
  Partial<Record<SimOptionValue, ScoreCell>>
>;

/**
 * 문항마다 A/B/C가 서로 다른 유형에 점수를 주므로,
 * 선택값에 매핑된 칸만 유형별로 더한다.
 */
export function scoreSimTest(answers: SimAnswers) {
  return TYPE_CODES.reduce(
    (totals, typeCode) => ({
      ...totals,
      [typeCode]: sumBy(SIM_TEST.questions, (question) => {
        const optionValue = answers[question.id];

        if (!optionValue) {
          return 0;
        }

        return scoreTable[`Q${question.id}`]?.[optionValue]?.[typeCode] ?? 0;
      }),
    }),
    {} as Record<SimTypeCode, number>,
  );
}

function typeFromOption(questionId: number, optionValue: SimOptionValue | undefined) {
  if (!optionValue) {
    return null;
  }

  const cell = scoreTable[`Q${questionId}`]?.[optionValue];

  return TYPE_CODES.find((typeCode) => (cell?.[typeCode] ?? 0) > 0) ?? null;
}

/**
 * 최고점 유형이 하나면 그 유형을 쓰고,
 * 동점이면 A-C는 A, B-D는 B, 두 그룹이 함께 동점이면 10번 문항 유형을 우선한다.
 */
export function resolveSimType(answers: SimAnswers): SimTypeCode {
  const scores = scoreSimTest(answers);
  const highestScore = Math.max(...TYPE_CODES.map((typeCode) => scores[typeCode]));
  const leaders = TYPE_CODES.filter((typeCode) => scores[typeCode] === highestScore);

  if (leaders.length === 1) {
    return leaders[0];
  }

  const tenthQuestionType = typeFromOption(10, answers[10]);
  const spansBothGroups =
    leaders.some((typeCode) => typeCode === 'TYPE_A' || typeCode === 'TYPE_C') &&
    leaders.some((typeCode) => typeCode === 'TYPE_B' || typeCode === 'TYPE_D');

  return match({
    spansBothGroups,
    hasManagerTie: leaders.includes('TYPE_A') && leaders.includes('TYPE_C'),
    hasMentorTie: leaders.includes('TYPE_B') && leaders.includes('TYPE_D'),
    tenthQuestionType,
  })
    .with({ spansBothGroups: true }, ({ tenthQuestionType: preferredType }) => {
      if (preferredType && leaders.includes(preferredType)) {
        return preferredType;
      }

      return leaders[0];
    })
    .with({ hasManagerTie: true }, () => 'TYPE_A' as const)
    .with({ hasMentorTie: true }, () => 'TYPE_B' as const)
    .otherwise(() => leaders[0]);
}

export function getSimResult(typeCode: SimTypeCode) {
  return SIM_TEST.results.find((result) => result.type_code === typeCode) ?? SIM_TEST.results[0];
}

export function isSimTestComplete(answers: SimAnswers) {
  return SIM_TEST.questions.every((question) => Boolean(answers[question.id]));
}
