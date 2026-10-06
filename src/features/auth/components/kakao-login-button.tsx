'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { authErrorClassName } from '@/features/auth/constants/ui';
import { hoverLinearClassName } from '@/features/landing/constants/ui';
import { cn } from '@/lib/utils';

type KakaoLoginButtonProps = {
  label?: string;
};

export function KakaoLoginButton({ label = '카카오 계정으로 로그인' }: KakaoLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleKakaoLogin = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await signIn('kakao', {
        redirect: false,
        callbackUrl: '/',
      });

      if (result?.error) {
        setError('로그인 중 오류가 발생했습니다.');
        console.error(result.error);
        setLoading(false);
        return;
      }

      if (result?.url) {
        window.location.assign(result.url);
        return;
      }

      setError('로그인 중 오류가 발생했습니다.');
      setLoading(false);
    } catch (caughtError) {
      setError('로그인 중 오류가 발생했습니다.');
      console.error(caughtError);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error ? (
        <p className={authErrorClassName} role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleKakaoLogin}
        disabled={loading}
        className={cn(
          hoverLinearClassName,
          'relative flex h-12 min-h-11 w-full items-center justify-center rounded-full bg-[#FEE500] px-6 text-sm font-semibold text-[#191919] hover:bg-[#F5DC00] hover:shadow-[0_0_28px_rgba(254,229,0,0.35)] disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        {loading ? (
          '로그인 중...'
        ) : (
          <>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-[#191919]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 208 191.94"
                aria-hidden
              >
                <path
                  d="M104,0C46.56,0,0,36.71,0,82c0,29.28,19.47,55,48.75,69.48-1.59,5.49-10.24,35.34-10.58,37.69,0,0-.21,1.76.93,2.43a3.14,3.14,0,0,0,2.48.15c3.28-.46,38-24.81,44-29A131.56,131.56,0,0,0,104,164c57.44,0,104-36.71,104-82S161.44,0,104,0ZM52.53,69.27c-.13,11.6.1,23.8-.09,35.22-.06,3.65-2.16,4.74-5,5.78a1.88,1.88,0,0,1-1,.07c-3.25-.64-5.84-1.8-5.92-5.84-.23-11.41.07-23.63-.09-35.23-2.75-.12-6.67.11-9.22,0-3.54-.23-6-2.48-5.85-5.83s1.94-5.76,5.91-5.82c9.38-.14,21-.14,30.38,0,4,.06,5.78,2.48,5.9,5.82s-2.3,5.6-5.83,5.83C59.2,69.38,55.29,69.15,52.53,69.27Zm50.4,40.45a9.24,9.24,0,0,1-3.82.83c-2.5,0-4.41-1-5-2.65l-3-7.78H72.85l-3,7.78c-.58,1.63-2.49,2.65-5,2.65a9.16,9.16,0,0,1-3.81-.83c-1.66-.76-3.25-2.86-1.43-8.52L74,63.42a9,9,0,0,1,8-5.92,9.07,9.07,0,0,1,8,5.93l14.34,37.76C106.17,106.86,104.58,109,102.93,109.72Zm30.32,0H114a5.64,5.64,0,0,1-5.75-5.5V63.5a6.13,6.13,0,0,1,12.25,0V98.75h12.75a5.51,5.51,0,1,1,0,11Zm47-4.52A5.49,5.49,0,0,1,175,110a5.21,5.21,0,0,1-3.89-1.73L156.16,90.64V104.3a5.57,5.57,0,1,1-11.13,0V63.5a5.57,5.57,0,1,1,11.13,0V77.16L171.07,59.8a5.41,5.41,0,0,1,3.87-1.68,5.57,5.57,0,0,1,5.38,5.48A5.09,5.09,0,0,1,179,67.43L164.6,82.89l14.6,16.15A5.4,5.4,0,0,1,180.22,105.2Z"
                  fill="currentColor"
                />
                <path d="M80.33,70.92h11.78L86.22,58.24Z" fill="currentColor" />
              </svg>
            </span>
            {label}
          </>
        )}
      </button>
    </div>
  );
}
