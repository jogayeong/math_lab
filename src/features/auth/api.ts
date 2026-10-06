import type { SignupRequest } from '@/features/auth/lib/signup';

export type SignupResult = { ok: true; message: null } | { ok: false; message: string };

/** strictNullChecks가 꺼져 있어도 실패 메시지가 있는 분기로 좁힌다. */
export function isSignupFailure(
  result: SignupResult,
): result is Extract<SignupResult, { ok: false }> {
  return result.ok === false;
}

/** 회원가입 API에 계정을 만들고, 실패 메시지를 그대로 돌려준다. */
export async function requestSignup(values: SignupRequest): Promise<SignupResult> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (response.ok) {
    return { ok: true, message: null };
  }

  const body = (await response.json().catch(() => null)) as { message?: string } | null;

  return {
    ok: false,
    message: body?.message ?? '회원가입 중 오류가 발생했습니다.',
  };
}
