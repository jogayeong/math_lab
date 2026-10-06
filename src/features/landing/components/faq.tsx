'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQ_ITEMS } from '@/features/landing/constants/content';
import { SectionHeading, SectionShell } from '@/features/landing/components/section-shell';

export function Faq() {
  return (
    <SectionShell id="faq">
      <SectionHeading
        eyebrow="FAQ"
        title="상담 전에 자주 묻는 질문"
        description="수강료, 보충, 교재, 셔틀처럼 등록 전에 확인하는 항목을 먼저 열어 두었습니다."
      />
      <Accordion type="single" collapsible className="mx-auto max-w-3xl rounded-2xl border border-primary-500/30 bg-neutral-800/50 px-5">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item.id} value={item.id} className="border-neutral-700">
            <AccordionTrigger className="min-h-11 py-5 text-left text-base text-neutral-100 transition-colors duration-500 ease-linear hover:text-primary-400 hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed text-neutral-400">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionShell>
  );
}
