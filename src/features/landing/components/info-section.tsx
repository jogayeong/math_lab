'use client';

import { Bus, Clock, MapPin, Phone } from 'lucide-react';
import { ACADEMY } from '@/features/landing/constants/content';
import { neonCardClassName } from '@/features/landing/constants/ui';
import { SectionHeading, SectionShell } from '@/features/landing/components/section-shell';
import { cn } from '@/lib/utils';

export function InfoSection() {
  return (
    <SectionShell id="info">
      <SectionHeading
        eyebrow="VISIT"
        title="오시는 길과 운영 시간"
        description="대치권 상담은 방문이 가장 정확합니다. 노선과 운영 시간을 확인한 뒤 예약을 잡아 주세요."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={cn(neonCardClassName, 'overflow-hidden p-0')}>
          <iframe
            title="MATH.LAB 오시는 길"
            src="https://www.openstreetmap.org/export/embed.html?bbox=127.048%2C37.494%2C127.066%2C37.506&layer=mapnik&marker=37.4996%2C127.0572"
            className="h-72 w-full grayscale md:h-80"
            loading="lazy"
          />
          <div className="flex items-start justify-between gap-4 p-5">
            <p className="text-sm leading-relaxed text-neutral-300">{ACADEMY.address}</p>
            <a
              href={ACADEMY.kakaoMapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center text-sm font-medium text-primary-400 hover:text-primary-300"
            >
              지도 앱으로 보기
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          <article className={cn(neonCardClassName, 'p-5')}>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-primary-500" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-neutral-100">주소</h3>
                <p className="mt-1 text-sm text-neutral-400">{ACADEMY.address}</p>
              </div>
            </div>
          </article>
          <article className={cn(neonCardClassName, 'p-5')}>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-secondary-400" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-neutral-100">대표 연락처</h3>
                <a href={ACADEMY.phoneHref} className="mt-1 inline-flex min-h-11 items-center text-sm text-neutral-300">
                  {ACADEMY.phone}
                </a>
              </div>
            </div>
          </article>
          <article className={cn(neonCardClassName, 'p-5')}>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-accent-400" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-neutral-100">운영 시간</h3>
                <ul className="mt-2 space-y-1 text-sm text-neutral-400">
                  {ACADEMY.hours.map((hour) => (
                    <li key={hour.label}>
                      {hour.label} {hour.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
          <article className={cn(neonCardClassName, 'p-5')}>
            <div className="flex items-start gap-3">
              <Bus className="mt-0.5 h-5 w-5 text-primary-400" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-neutral-100">셔틀 노선</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {ACADEMY.shuttles.map((stop) => (
                    <li
                      key={stop}
                      className="rounded-full border border-secondary-500/40 px-3 py-1 text-sm text-secondary-300"
                    >
                      {stop}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    </SectionShell>
  );
}
