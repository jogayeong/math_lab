import { NextResponse } from 'next/server';
import { match } from 'ts-pattern';
import { reservationPayloadSchema } from '@/features/landing/lib/reservation';
import { createPureClient } from '@/lib/supabase/server';

type CreateConsultationReservationRow = {
  result_code: string;
  id: string | null;
};

const reservationFailureMessage = (resultCode: string) =>
  match(resultCode)
    .with('invalid_input', () => '입력값을 확인해 주세요.')
    .with('past_datetime', () => '현재 시각 이후의 일시를 선택해 주세요.')
    .otherwise(() => '상담 예약 중 오류가 발생했습니다.');

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = reservationPayloadSchema.safeParse(payload);

  if (!parsed.success) {
    const isPastDateTime = parsed.error.issues.some((issue) =>
      issue.path.includes('preferredDateTime'),
    );

    return NextResponse.json(
      {
        message: isPastDateTime
          ? '현재 시각 이후의 일시를 선택해 주세요.'
          : '입력값을 확인해 주세요.',
      },
      { status: 400 },
    );
  }

  const supabase = await createPureClient();
  const { data, error } = await supabase.rpc('create_consultation_reservation', {
    p_student_name: parsed.data.studentName,
    p_grade: parsed.data.grade,
    p_parent_phone: parsed.data.parentPhone,
    p_preferred_at: parsed.data.preferredDateTime,
    p_level_test_result: parsed.data.levelTestResult,
    p_style_test_result: parsed.data.styleTestResult,
  });

  if (error) {
    console.error('방문 상담 예약 저장에 실패했습니다.', error.message);
    const message = error.message.includes('create_consultation_reservation')
      ? '예약 함수가 데이터베이스에 없습니다. Supabase SQL Editor에서 0007 마이그레이션을 실행해 주세요.'
      : '상담 예약 중 오류가 발생했습니다.';

    return NextResponse.json({ message }, { status: 500 });
  }

  const reservation = (Array.isArray(data) ? data[0] : data) as CreateConsultationReservationRow | null;

  if (!reservation) {
    return NextResponse.json({ message: '상담 예약 중 오류가 발생했습니다.' }, { status: 500 });
  }

  if (reservation.result_code !== 'created') {
    const status = match(reservation.result_code)
      .with('invalid_input', 'past_datetime', () => 400)
      .otherwise(() => 500);

    return NextResponse.json(
      { message: reservationFailureMessage(reservation.result_code) },
      { status },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
