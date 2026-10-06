'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { hoverLinearClassName } from '@/features/landing/constants/ui';
import { cn } from '@/lib/utils';

const authButtonClassName = cn(
  hoverLinearClassName,
  'h-11 min-h-11 rounded-full border-primary-500/40 bg-transparent px-4 text-sm font-semibold text-neutral-100 hover:bg-primary-500/10 hover:text-primary-400',
);

type AuthActionsProps = {
  className?: string;
  layout?: 'row' | 'stack';
  onNavigate?: () => void;
};

export function AuthActions({ className, layout = 'row', onNavigate }: AuthActionsProps) {
  const { status } = useSession();
  const isStacked = layout === 'stack';

  if (status === 'loading') {
    return <div className={cn('h-11', className)} aria-hidden />;
  }

  if (status === 'authenticated') {
    return (
      <div className={cn('flex items-center gap-2', isStacked && 'flex-col', className)}>
        <Button
          type="button"
          variant="outline"
          className={cn(authButtonClassName, isStacked && 'w-full')}
          onClick={() => {
            onNavigate?.();
            void signOut({ callbackUrl: '/' });
          }}
        >
          로그아웃
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', isStacked && 'flex-col', className)}>
      <Button asChild variant="outline" className={cn(authButtonClassName, isStacked && 'w-full')}>
        <Link href="/auth/login-idpw" onClick={onNavigate}>
          로그인
        </Link>
      </Button>
      <Button asChild variant="outline" className={cn(authButtonClassName, isStacked && 'w-full')}>
        <Link href="/auth/signup" onClick={onNavigate}>
          회원가입
        </Link>
      </Button>
    </div>
  );
}
