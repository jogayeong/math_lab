export const ACADEMY = {
  name: 'MATH.LAB',
  phone: '02-1234-5678',
  phoneHref: 'tel:0212345678',
  address: '서울특별시 강남구 삼성로 123, 3층',
  kakaoMapUrl:
    'https://map.kakao.com/link/search/서울특별시 강남구 삼성로 123',
  hours: [
    { label: '평일', value: '14:00 – 22:00' },
    { label: '토요일', value: '10:00 – 18:00' },
    { label: '일요일·공휴일', value: '휴무' },
  ],
  shuttles: ['대치역', '은마아파트', '개포동', '수서역'],
  business: {
    owner: '김도윤',
    registrationNumber: '123-45-67890',
  },
} as const;

export const HERO = {
  eyebrow: 'NEON MATH ALGORITHM',
  title: ['상위 1%로 향하는', '가장 완벽한', '수학 알고리즘'],
  description:
    '개념, 오답, 등원까지 데이터로 설계합니다. 중·고등 수학의 빈칸을 메우고, 다음 시험의 등급을 바꿉니다.',
  image: {
    src: '/images/landing/hero-math-lab.jpg',
    alt: '시안 조명 아래 수식이 적힌 유리 보드와 야간 수학 강의실',
  },
} as const;

export const INTRO = {
  eyebrow: 'ACADEMY',
  title: '개인별 맞춤형 수학 성장의 기준',
  description:
    '같은 학년도 출발선은 다릅니다. MATH.LAB은 학생마다 막히는 문항을 기록하고, 그 기록으로 다음 주 수업을 다시 짭니다.',
  points: [
    '개념 이해와 적용을 분리해 진단합니다.',
    '틀린 이유를 유형이 아니라 사고 단계로 남깁니다.',
    '강의실과 개별 자습실을 오가며 바로 복습합니다.',
  ],
  gallery: [
    {
      src: '/images/landing/academy-classroom.jpg',
      alt: '칠판 앞에서 소규모 수학 수업이 진행되는 MATH.LAB 강의실',
      caption: '강의실',
    },
    {
      src: '/images/landing/academy-studyhall.jpg',
      alt: '칸막이 좌석에서 개별 학습하는 MATH.LAB 자습실',
      caption: '개별 자습실',
    },
  ],
} as const;

export const STATS = [
  {
    value: '1.5',
    unit: '등급',
    label: '평균 성적 상승',
    description: '재원 6개월 기준, 내신 수학 등급 변화의 평균입니다.',
  },
  {
    value: '94',
    unit: '%',
    label: '명문대 합격률',
    description: '최근 3개년 고3 재원생의 수도권 주요 대학 합격 비율입니다.',
  },
  {
    value: '98',
    unit: '%',
    label: '재원생 만족도',
    description: '학부모 설문에서 학습 관리 항목에 만족한다고 답한 비율입니다.',
  },
] as const;

export const DIFFERENTIATORS = [
  {
    title: '1:1 오답 클리닉',
    description:
      '틀린 문항을 당일 회수합니다. 강사가 풀이를 대신 적지 않고, 학생이 막힌 단계에서 다시 말하게 합니다.',
  },
  {
    title: '주간 성취도 리포트',
    description:
      '테스트 결과를 단원·유형·실수로 나눠 매주 공유합니다. 다음 주 과제는 이 리포트에서 바로 정해집니다.',
  },
  {
    title: '등원 관리',
    description:
      '출결, 과제, 오답 제출을 한 흐름으로 확인합니다. 빠지면 당일 학부모 연락으로 빈칸을 메웁니다.',
  },
] as const;

export const INSTRUCTORS = [
  {
    name: '한서진',
    subject: '고등 수학 I · 수학 II',
    career: '서울대 수리과학부 · 대치 강의 12년',
    detail: '킬러 문항을 조건 독해와 식으로 쪼개, 학생이 어디서 멈추는지 먼저 찾습니다.',
    image: '/images/landing/instructor-han.jpg',
  },
  {
    name: '정민재',
    subject: '확률과 통계 · 미적분',
    career: 'KAIST 수리과학과 · 평가원 문항 분석',
    detail: '선택과목은 계산량보다 판단 순서를 훈련합니다. 주간 리포트의 오답 태그를 직접 설계합니다.',
    image: '/images/landing/instructor-jung.jpg',
  },
  {
    name: '오유진',
    subject: '중등 · 고1 공통수학',
    career: '연세대 수학교육과 · 내신 대비 8년',
    detail: '중학교에서 흔들리는 개념을 고1 수행·지필 형식으로 다시 잇습니다.',
    image: '/images/landing/instructor-oh.jpg',
  },
] as const;

export const REVIEWS = [
  {
    quote:
      '고1 첫 지필 4등급에서 한 학기 만에 2등급이 됐습니다. 오답을 다음 날로 넘기지 않는 점이 달랐습니다.',
    name: '박지영',
    meta: '고1 학부모 · 4등급 → 2등급',
  },
  {
    quote:
      '주간 리포트에 아이가 막힌 유형이 적혀 있어 상담이 짧아졌습니다. 무엇을 시키는지 보이게 됐습니다.',
    name: '최은호',
    meta: '중3 학부모 · 성취도 향상',
  },
  {
    quote:
      '킬러만 많이 푸는 학원이 아니었습니다. 조건 해석이 느린 이유를 집어서 과제가 줄었습니다.',
    name: '이승아',
    meta: '고2 학부모 · 미적분 선택',
  },
  {
    quote:
      '등원 문자가 당일에 와서 빠지는 날이 줄었습니다. 자습실에서 오답을 끝내고 집에 옵니다.',
    name: '김하늘',
    meta: '고1 학부모 · 출결 관리',
  },
] as const;

export const LEVEL_QUESTIONS = [
  {
    id: 'grade',
    prompt: '학생의 현재 학년은 어디인가요?',
    options: [
      { id: 'middle', label: '중학교', score: 1 },
      { id: 'high1', label: '고등학교 1학년', score: 2 },
      { id: 'high2', label: '고등학교 2학년', score: 3 },
      { id: 'high3', label: '고등학교 3학년', score: 3 },
    ],
  },
  {
    id: 'achievement',
    prompt: '최근 수학 성취도는 어느 정도인가요?',
    options: [
      { id: 'top', label: '1–2등급 · 상위권이 안정적이에요', score: 4 },
      { id: 'rising', label: '3–4등급 · 오르락내리락해요', score: 3 },
      { id: 'basic', label: '5등급 이하 · 기초부터 다시 봐야 해요', score: 1 },
      { id: 'none', label: '최근 시험 결과가 없어요', score: 0 },
    ],
  },
  {
    id: 'pain',
    prompt: '지금 가장 막히는 지점은 무엇인가요?',
    options: [
      { id: 'concept', label: '개념 정의가 흔들려요', score: 1 },
      { id: 'apply', label: '유형은 아는데 적용이 안 돼요', score: 2 },
      { id: 'time', label: '풀다가 시간이 부족해요', score: 3 },
      { id: 'killer', label: '고난도·킬러 문항에서 멈춰요', score: 4 },
    ],
  },
  {
    id: 'hours',
    prompt: '일주일 수학 학습 시간은 어느 정도인가요?',
    options: [
      { id: 'under3', label: '3시간 미만', score: 1 },
      { id: 'mid', label: '3–6시간', score: 2 },
      { id: 'high', label: '6–10시간', score: 3 },
      { id: 'max', label: '10시간 이상', score: 4 },
    ],
  },
] as const;

export const COURSES = {
  foundation: {
    name: '개념 완성 코스',
    summary: '정의와 기본 유형을 다시 고정한 뒤, 학교 진도에 맞춰 과제를 짧게 끊습니다.',
    points: ['개념 확인 질문', '오답 3문항 제한', '주 2회 클리닉'],
  },
  school: {
    name: '내신 집중 코스',
    summary: '학교 프린트와 기출을 기준으로, 반복되는 실수 유형만 남겨 주간 리포트에 담습니다.',
    points: ['학교별 기출 분해', '서술형 문장 훈련', '시험 2주 집중 관리'],
  },
  advanced: {
    name: '상위권 심화 코스',
    summary: '맞는 문항의 시간을 줄이고, 조건이 꼬이는 문항에서 판단 순서를 훈련합니다.',
    points: ['시간 로그', '준킬러 세트', '주간 오답 태깅'],
  },
  killer: {
    name: '킬러 문항 코스',
    summary: '평가원·교육청 고난도를 축으로, 막힌 단계를 말로 설명하는 클리닉을 진행합니다.',
    points: ['조건 재진술', '풀이 분기 정리', '심화 과제 선별'],
  },
} as const;

export const FAQ_ITEMS = [
  {
    id: 'tuition',
    question: '수강료는 어떻게 안내되나요?',
    answer:
      '학년과 코스, 주당 시수에 따라 달라집니다. 방문 상담에서 시간표를 확정한 뒤 수강료를 안내하며, 온라인 레벨 진단은 무료입니다.',
  },
  {
    id: 'absence',
    question: '결석하면 보충 수업이 되나요?',
    answer:
      '수업 전날까지 연락하면 같은 주 안에 1회 보충을 배정합니다. 당일 결석은 오답 클리닉 과제로 대체하고, 학부모에게 등원 현황을 문자로 남깁니다.',
  },
  {
    id: 'materials',
    question: '교재비는 별도인가요?',
    answer:
      '학기 초 자체 부교재비가 별도입니다. 시중 교재는 반 배정 후 구매 목록을 드리며, 이미 가진 교재가 있으면 상담에서 조정합니다.',
  },
  {
    id: 'shuttle',
    question: '셔틀버스는 어디까지 운행하나요?',
    answer:
      '대치역, 은마아파트, 개포동, 수서역 노선을 운행합니다. 좌석은 선착순이며, 정확한 탑승 시각은 등록 후 노선표로 안내합니다.',
  },
] as const;
