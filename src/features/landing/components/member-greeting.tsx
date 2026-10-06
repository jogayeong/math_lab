'use client';

import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

type MemberGreetingProps = {
  className?: string;
};

/**
 * 로그인 세션의 표시 이름을 히어로 문구로 보여 준다.
 * 카카오 로그인은 닉네임, 홈페이지 가입 로그인은 이름이 세션 name에 들어 있다.
 */
export function MemberGreeting({ className }: MemberGreetingProps) {
  const { data: session, status } = useSession();
  const displayName = session?.user.name?.trim();

  if (status !== 'authenticated' || !displayName) {
    return null;
  }

  return (
    <p className={cn('text-base font-semibold text-secondary-300 md:text-lg', className)}>
      {displayName}님을 위한 정보
    </p>
  );
}
