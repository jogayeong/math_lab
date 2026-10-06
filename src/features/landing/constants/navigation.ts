export const NAV_ITEMS = [
  { id: 'intro', label: '학원소개' },
  { id: 'stats', label: '통계실적' },
  { id: 'differentiators', label: '차별점' },
  { id: 'instructors', label: '강사진' },
  { id: 'level-test', label: '레벨진단' },
  { id: 'parent-style', label: '유형진단' },
  { id: 'info', label: '학원정보' },
  { id: 'reservation', label: '방문예약' },
] as const;

export const SECTION_IDS = NAV_ITEMS.map((item) => item.id);
