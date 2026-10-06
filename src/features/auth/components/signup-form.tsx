'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { requestSignup } from '@/features/auth/api';
import { signupSchema, type SignupFormValues } from '@/features/auth/lib/signup';

const inputClassName =
  'relative block w-full rounded-md border-0 bg-white py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6';

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

    if (signupResult.ok === false) {
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
    <form className="mt-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {error ? (
        <div className="rounded-md bg-red-50 p-4" role="alert">
          <p className="text-sm text-red-700">{error}</p>
        </div>
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

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
      >
        {form.formState.isSubmitting ? '가입 중...' : '회원가입'}
      </button>

      <p className="text-center text-sm text-neutral-300">
        이미 계정이 있으신가요?{' '}
        <Link href="/auth/login-idpw" className="font-semibold text-indigo-300 hover:text-indigo-200">
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
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-neutral-100">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={inputClassName}
        {...registration}
      />
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
