import { toReservationPayload, type ReservationFormValues } from '@/features/landing/lib/reservation';

type ReservationResult = { ok: true } | { ok: false; message: string };

/** 방문 상담 예약을 저장하고, 실패 메시지를 그대로 돌려준다. */
export async function requestReservation(values: ReservationFormValues): Promise<ReservationResult> {
  const response = await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toReservationPayload(values)),
  }).catch(() => null);

  if (!response) {
    return { ok: false, message: '상담 예약 중 오류가 발생했습니다.' };
  }

  if (response.ok) {
    return { ok: true };
  }

  const body = (await response.json().catch(() => null)) as { message?: string } | null;

  return {
    ok: false,
    message: body?.message ?? '상담 예약 중 오류가 발생했습니다.',
  };
}
