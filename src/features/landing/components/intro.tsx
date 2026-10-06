'use client';

import { INTRO } from '@/features/landing/constants/content';
import { Reveal } from '@/features/landing/components/reveal';
import { SectionHeading, SectionShell } from '@/features/landing/components/section-shell';

export function Intro() {
  return (
    <SectionShell id="intro">
      <SectionHeading eyebrow={INTRO.eyebrow} title={INTRO.title} description={INTRO.description} />
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <Reveal>
          <ul className="space-y-4">
            {INTRO.points.map((point) => (
              <li
                key={point}
                className="rounded-2xl border border-primary-500/30 bg-neutral-800/50 px-5 py-4 text-neutral-100 transition-[border-color,background-color,transform,box-shadow] duration-500 ease-linear hover:-translate-y-0.5 hover:border-primary-500/60 hover:shadow-[0_0_16px_rgba(31,221,215,0.25)]"
              >
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {INTRO.gallery.map((image, index) => (
            <Reveal key={image.src} delay={index * 0.08}>
              <figure className="group overflow-hidden rounded-2xl border border-primary-500/30">
                <img
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={600}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-linear group-hover:scale-105"
                />
                <figcaption className="bg-neutral-800 px-4 py-3 text-sm text-secondary-400">
                  {image.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
