'use client';

import { SignupForm } from '@/features/auth/components/signup-form';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-neutral-50">
            회원가입
          </h1>
          <p className="mt-2 text-center text-sm text-neutral-300">
            아이디는 영문, 숫자, 밑줄 4자 이상이고 비밀번호는 8자 이상이어야 합니다.
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
