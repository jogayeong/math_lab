import { NextResponse } from 'next/server';
import { match } from 'ts-pattern';
import { signupRequestSchema } from '@/features/auth/lib/signup';
import { createPureClient } from '@/lib/supabase/server';

type RegisterLoginAccountRow = {
  result_code: string;
  id: string | null;
  name: string | null;
  email: string | null;
};

const signupFailureMessage = (resultCode: string) =>
  match(resultCode)
    .with('duplicate_login_id', () => '이미 사용 중인 아이디입니다.')
    .with('duplicate_email', () => '이미 사용 중인 이메일입니다.')
    .with('invalid_input', () => '입력값을 확인해 주세요.')
    .otherwise(() => '회원가입 중 오류가 발생했습니다.');

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = signupRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: '입력값을 확인해 주세요.' }, { status: 400 });
  }

  const supabase = await createPureClient();
  const { data, error } = await supabase.rpc('register_login_account', {
    p_login_id: parsed.data.loginId,
    p_password: parsed.data.password,
    p_name: parsed.data.name,
    p_email: parsed.data.email,
  });

  if (error) {
    console.error('login_account 가입에 실패했습니다.', error.message);
    const message = error.message.includes('register_login_account')
      ? '회원가입 함수가 데이터베이스에 없습니다. Supabase SQL Editor에서 0002, 0003, 0004 마이그레이션을 순서대로 실행해 주세요.'
      : '회원가입 중 오류가 발생했습니다.';

    return NextResponse.json({ message }, { status: 500 });
  }

  const account = (Array.isArray(data) ? data[0] : data) as RegisterLoginAccountRow | null;

  if (!account) {
    return NextResponse.json(
      { message: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }

  if (account.result_code !== 'created') {
    const status = match(account.result_code)
      .with('duplicate_login_id', 'duplicate_email', () => 409)
      .with('invalid_input', () => 400)
      .otherwise(() => 500);

    return NextResponse.json(
      { message: signupFailureMessage(account.result_code) },
      { status },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
