'use client';

import { Differentiators } from '@/features/landing/components/differentiators';
import { Faq } from '@/features/landing/components/faq';
import { Hero } from '@/features/landing/components/hero';
import { InfoSection } from '@/features/landing/components/info-section';
import { Instructors } from '@/features/landing/components/instructors';
import { Intro } from '@/features/landing/components/intro';
import { LevelTestWidget } from '@/features/landing/components/level-test-widget';
import { Reservation } from '@/features/landing/components/reservation';
import { SimTest } from '@/features/landing/components/sim-test';
import { Reviews } from '@/features/landing/components/reviews';
import { SiteFooter } from '@/features/landing/components/site-footer';
import { Stats } from '@/features/landing/components/stats';
import { Topbar } from '@/features/landing/components/topbar';

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-neutral-900 text-neutral-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute right-0 top-[28rem] h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="absolute bottom-40 left-1/3 h-72 w-72 rounded-full bg-secondary-500/15 blur-3xl" />
      </div>

      <Topbar />
      <main>
        <Hero />
        <Intro />
        <Stats />
        <Differentiators />
        <Instructors />
        <Reviews />
        <LevelTestWidget />
        <SimTest />
        <Faq />
        <InfoSection />
        <Reservation />
      </main>
      <SiteFooter />
    </div>
  );
}
