import { format, isAfter, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { z } from 'zod';

export const GRADE_OPTIONS = ['중1', '중2', '중3', '고1', '고2', '고3'] as const;

const phonePattern = /^01[016789]-?\d{3,4}-?\d{4}$/;

const studentNameSchema = z
  .string()
  .trim()
  .min(2, '학생 이름을 2자 이상 입력해 주세요.')
  .max(20, '학생 이름은 20자 이하로 입력해 주세요.');

const gradeSchema = z.enum(GRADE_OPTIONS, {
  required_error: '학년을 선택해 주세요.',
  invalid_type_error: '학년을 선택해 주세요.',
});

const parentPhoneSchema = z
  .string()
  .trim()
  .regex(phonePattern, '010-0000-0000 형식으로 입력해 주세요.');

const futureDateTimeMessage = '현재 시각 이후의 일시를 선택해 주세요.';

const isFutureDateTime = (value: string) => {
  const parsed = parseISO(value);
  return !Number.isNaN(parsed.getTime()) && isAfter(parsed, new Date());
};

const levelTestResultSchema = z
  .string()
  .trim()
  .max(2000, '레벨 진단 결과가 너무 깁니다.');

const styleTestResultSchema = z
  .string()
  .trim()
  .max(4000, '유형 진단 결과가 너무 깁니다.');

export const reservationSchema = z.object({
  studentName: studentNameSchema,
  grade: gradeSchema,
  parentPhone: parentPhoneSchema,
  preferredDateTime: z
    .string()
    .min(1, '희망 상담 일시를 선택해 주세요.')
    .refine(isFutureDateTime, futureDateTimeMessage),
  levelTestResult: levelTestResultSchema,
  styleTestResult: styleTestResultSchema,
});

/** 브라우저 로컬 시각을 UTC ISO로 바꾼 뒤 서버에 넘긴다. */
export const reservationPayloadSchema = z.object({
  studentName: studentNameSchema,
  grade: gradeSchema,
  parentPhone: parentPhoneSchema,
  preferredDateTime: z.string().refine(isFutureDateTime, futureDateTimeMessage),
  levelTestResult: levelTestResultSchema,
  styleTestResult: styleTestResultSchema,
});

export type ReservationFormValues = z.infer<typeof reservationSchema>;
export type ReservationPayload = z.infer<typeof reservationPayloadSchema>;

export function toReservationPayload(values: ReservationFormValues): ReservationPayload {
  return {
    ...values,
    preferredDateTime: new Date(values.preferredDateTime).toISOString(),
  };
}

export function formatConsultationTime(value: string) {
  return format(parseISO(value), 'yyyy년 M월 d일 (EEE) a h:mm', { locale: ko });
}
