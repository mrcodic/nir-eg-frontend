"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="mx-auto mt-6 max-w-[760px] space-y-4 p-0"
    >
      {faqs.map((faq, i) => (
        <motion.div
          key={`${faq.q}-${i}`}
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <AccordionItem
            value={`item-${faq.q}-${i}`}
            className="rounded-xl data-[state=closed]:border-none data-[state=open]:bg-background data-[state=open]:border data-[state=open]:border-primary-800 bg-white p-4"
          >
            <AccordionTrigger className="p-0 text-start text-sm font-extrabold text-black-3 hover:no-underline tablet:text-xl">
              <p className="flex items-center gap-4">{faq.q}</p>
            </AccordionTrigger>
            <AccordionContent className="mt-4 border-t-2 border-gray-light pt-4 text-xs font-medium text-black-3 tablet:text-lg">
              <p className="flex items-start gap-4 leading-6">{faq.a}</p>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      ))}
    </Accordion>
  );
}

export default FAQAccordion;
