'use client';

import { ACADEMY } from '@/features/landing/constants/content';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-4 py-12 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-neutral-500 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-lg font-extrabold tracking-[0.18em] text-primary-500">
            {ACADEMY.name}
          </p>
          <p className="mt-3">대표 {ACADEMY.business.owner}</p>
          <p>사업자등록번호 {ACADEMY.business.registrationNumber}</p>
          <p>{ACADEMY.address}</p>
          <p>{ACADEMY.phone}</p>
        </div>
        <p>© {new Date().getFullYear()} MATH.LAB. All rights reserved.</p>
      </div>
    </footer>
  );
}
