'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { faqs } from '@/lib/services'

export function Faq() {
  return (
    <Accordion defaultValue={[faqs[0].q]} className="flex flex-col gap-3">
      {faqs.map((f) => (
        <AccordionItem
          key={f.q}
          value={f.q}
          className="rounded-2xl border-none bg-card px-5 shadow-soft ring-1 ring-border/60 md:px-6"
        >
          <AccordionTrigger className="min-h-16 items-center py-4 text-base font-semibold text-navy hover:no-underline">
            {f.q}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
            {f.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
