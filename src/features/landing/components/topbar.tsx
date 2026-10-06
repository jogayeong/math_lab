'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NAV_ITEMS, SECTION_IDS } from '@/features/landing/constants/navigation';
import { neonButtonClassName } from '@/features/landing/constants/ui';
import { useScrollSpy } from '@/features/landing/hooks/use-scroll-spy';
import { cn } from '@/lib/utils';

type NavLinksProps = {
  activeId: string;
  onNavigate?: () => void;
  className?: string;
  linkClassName?: string;
};

function NavLinks({ activeId, onNavigate, className, linkClassName }: NavLinksProps) {
  return (
    <nav className={className} aria-label="페이지 섹션">
      {NAV_ITEMS.map((item) => {
        const isActive = activeId === item.id;

        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={onNavigate}
            aria-current={isActive ? 'location' : undefined}
            className={cn(
              'inline-flex min-h-11 items-center text-sm font-medium text-neutral-300 transition hover:text-primary-400',
              isActive && 'text-primary-500',
              linkClassName,
            )}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

export function Topbar() {
  const activeId = useScrollSpy(SECTION_IDS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-neutral-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <a
          href="#hero"
          className="font-display text-xl font-extrabold tracking-[0.18em] text-primary-500"
        >
          MATH.LAB
        </a>

        <NavLinks activeId={activeId} className="hidden items-center gap-5 lg:flex" />

        <div className="flex items-center gap-2">
          <Button asChild className={cn(neonButtonClassName, 'px-4 lg:px-6')}>
            <a href="#reservation">
              <span className="lg:hidden">예약</span>
              <span className="hidden lg:inline">상담 예약</span>
            </a>
          </Button>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-11 w-11 border-primary-500/40 bg-transparent text-neutral-100 hover:bg-primary-500/10 hover:text-primary-400 lg:hidden"
                aria-label="메뉴 열기"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-neutral-700 bg-neutral-900 text-neutral-100"
            >
              <SheetHeader>
                <SheetTitle className="font-display tracking-[0.18em] text-primary-500">
                  MATH.LAB
                </SheetTitle>
                <SheetDescription className="text-neutral-400">
                  섹션으로 이동하는 메뉴입니다.
                </SheetDescription>
              </SheetHeader>
              <NavLinks
                activeId={activeId}
                onNavigate={() => setIsMenuOpen(false)}
                className="mt-8 flex flex-col gap-1"
                linkClassName="text-lg"
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
