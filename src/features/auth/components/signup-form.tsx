'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { isSignupFailure, requestSignup } from '@/features/auth/api';
import { KakaoLoginButton } from '@/features/auth/components/kakao-login-button';
import {
  authErrorClassName,
  authFieldClassName,
  authLinkClassName,
  authSubmitClassName,
} from '@/features/auth/constants/ui';
import { signupSchema, type SignupFormValues } from '@/features/auth/lib/signup';

const emptyValues: SignupFormValues = {
  name: '',
  loginId: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: emptyValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (values: SignupFormValues) => {
    setError('');

    const signupResult = await requestSignup({
      name: values.name,
      loginId: values.loginId,
      email: values.email,
      password: values.password,
    });

    if (isSignupFailure(signupResult)) {
      setError(signupResult.message);
      return;
    }

    const signInResult = await signIn('credentials', {
      redirect: false,
      id: values.loginId,
      password: values.password,
    });

    if (signInResult?.error) {
      router.push('/auth/login-idpw');
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {error ? (
        <p className={authErrorClassName} role="alert">
          {error}
        </p>
      ) : null}

      <SignupField
        id="name"
        label="이름"
        autoComplete="name"
        error={form.formState.errors.name?.message}
        registration={form.register('name')}
      />
      <SignupField
        id="loginId"
        label="아이디"
        autoComplete="username"
        error={form.formState.errors.loginId?.message}
        registration={form.register('loginId')}
      />
      <SignupField
        id="email"
        label="이메일"
        type="email"
        autoComplete="email"
        error={form.formState.errors.email?.message}
        registration={form.register('email')}
      />
      <SignupField
        id="password"
        label="비밀번호"
        type="password"
        autoComplete="new-password"
        error={form.formState.errors.password?.message}
        registration={form.register('password')}
      />
      <SignupField
        id="passwordConfirm"
        label="비밀번호 확인"
        type="password"
        autoComplete="new-password"
        error={form.formState.errors.passwordConfirm?.message}
        registration={form.register('passwordConfirm')}
      />

      <button type="submit" disabled={form.formState.isSubmitting} className={authSubmitClassName}>
        {form.formState.isSubmitting ? '가입 중...' : '회원가입'}
      </button>

      <div className="flex items-center gap-3 text-sm text-neutral-500">
        <span className="h-px flex-1 bg-primary-500/25" aria-hidden />
        또는
        <span className="h-px flex-1 bg-primary-500/25" aria-hidden />
      </div>

      <KakaoLoginButton />

      <p className="text-center text-sm text-neutral-400">
        이미 계정이 있으신가요?{' '}
        <Link href="/auth/login-idpw" className={authLinkClassName}>
          로그인
        </Link>
      </p>
    </form>
  );
}

type SignupFieldProps = {
  id: string;
  label: string;
  type?: string;
  autoComplete: string;
  error?: string;
  registration: UseFormRegisterReturn;
};

function SignupField({
  id,
  label,
  type = 'text',
  autoComplete,
  error,
  registration,
}: SignupFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-neutral-200">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={authFieldClassName}
        {...registration}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
