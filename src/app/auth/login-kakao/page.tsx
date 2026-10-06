'use client';

import { AuthScreen } from '@/features/auth/components/auth-screen';
import { KakaoLoginButton } from '@/features/auth/components/kakao-login-button';

export default function KakaoLoginPage() {
  return (
    <AuthScreen
      eyebrow="KAKAO"
      title="카카오 로그인"
      description="카카오 계정으로 간편하게 로그인하세요."
    >
      <KakaoLoginButton />
    </AuthScreen>
  );
}
