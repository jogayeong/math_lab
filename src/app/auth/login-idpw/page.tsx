'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthScreen } from '@/features/auth/components/auth-screen';
import {
  authErrorClassName,
  authFieldClassName,
  authLinkClassName,
  authSubmitClassName,
} from '@/features/auth/constants/ui';

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        id,
        password,
      });

      if (result?.error) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (caughtError) {
      setError('로그인 중 오류가 발생했습니다.');
      console.error(caughtError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      eyebrow="SIGN IN"
      title="로그인"
      description="등록한 아이디와 비밀번호로 MATH.LAB에 들어오세요."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error ? (
          <p className={authErrorClassName} role="alert">
            {error}
          </p>
        ) : null}

        <div>
          <label htmlFor="id" className="mb-2 block text-sm font-medium text-neutral-200">
            아이디
          </label>
          <input
            id="id"
            name="id"
            type="text"
            required
            autoComplete="username"
            className={authFieldClassName}
            value={id}
            onChange={(event) => setId(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-neutral-200">
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={authFieldClassName}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} className={authSubmitClassName}>
          {loading ? '로그인 중...' : '로그인'}
        </button>

        <p className="text-center text-sm text-neutral-400">
          계정이 없으신가요?{' '}
          <Link href="/auth/signup" className={authLinkClassName}>
            회원가입
          </Link>
        </p>
        <p className="text-center text-sm leading-relaxed text-neutral-500">
          테스트 계정 admin / admin1234 또는 user / user1234
        </p>
      </form>
    </AuthScreen>
  );
}
