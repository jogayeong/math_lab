import type { getSimResult } from '@/features/landing/lib/sim-test';

type LevelCourse = {
  name: string;
  summary: string;
  points: readonly string[];
};

type StyleResult = ReturnType<typeof getSimResult>;

/**
 * 상담 폼에는 결과 화면의 문장을 그대로 남긴다.
 * 코스 코드로 바꾸면 상담 화면과 저장값이 달라진다.
 */
export function formatLevelTestResult(result: LevelCourse) {
  return [result.name, result.summary, ...result.points].join('\n');
}

/** 유형 카드에 보이는 제목, 슬로건, 태그, 강점, 유의점, 상담 주제를 한 글로 모은다. */
export function formatStyleTestResult(result: StyleResult) {
  const topics = result.recommended_consultation_topics
    .map((topic, index) => `${String(index + 1).padStart(2, '0')} ${topic}`)
    .join('\n');

  return [
    result.title,
    result.slogan,
    result.tags.map((tag) => `#${tag}`).join(' '),
    result.description,
    `강점\n${result.pros}`,
    `유의점\n${result.cons}`,
    `상담에서 다루면 좋은 주제\n${topics}`,
  ].join('\n');
}
