import type { SignupRequest } from '@/features/auth/lib/signup';

type SignupResult = { ok: true } | { ok: false; message: string };

/** 회원가입 API에 계정을 만들고, 실패 메시지를 그대로 돌려준다. */
export async function requestSignup(values: SignupRequest): Promise<SignupResult> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (response.ok) {
    return { ok: true };
  }

  const body = (await response.json().catch(() => null)) as { message?: string } | null;

  return {
    ok: false,
    message: body?.message ?? '회원가입 중 오류가 발생했습니다.',
  };
}
