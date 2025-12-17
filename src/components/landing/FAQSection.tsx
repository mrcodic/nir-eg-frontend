"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaqSection } from "@/types/landing.types";

export default function FAQSection({ data }: { data: FaqSection }) {
  return (
    <section className="wrapper bg-background w-full relative text-center py-8 space-y-6 bg-[url('/bg-vector.png')] bg-cover bg-no-repeat">
      <h3 className="text-32 font-bold">
        يمكنك ان تجد{" "}
        <span className="text-primary-800 drop-shadow-text    ">
          {" "}
          الاجابات{" "}
        </span>
        لأسئلتك هنا
      </h3>
      <div className=" max-w-3xl mx-auto">
        <Accordion
          type="single"
          collapsible
          className="mx-auto mt-6 max-w-[760px] space-y-4 p-0"
        >
          {data.items.map((faq, i) => (
            <AccordionItem
              key={`${faq.q}-${i}`}
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
          ))}
        </Accordion>
      </div>
    </section>
  );
}
