'use client';

import { AuthScreen } from '@/features/auth/components/auth-screen';
import { SignupForm } from '@/features/auth/components/signup-form';

export default function SignupPage() {
  return (
    <AuthScreen
      eyebrow="JOIN"
      title="회원가입"
      description="아이디는 영문, 숫자, 밑줄 4자 이상이고 비밀번호는 8자 이상이어야 합니다."
    >
      <SignupForm />
    </AuthScreen>
  );
}
