import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import SummarySectionHeading from "./SummarySectionHeading";

import { SummaryTemplateContent } from "@/types/summary-template.types";
import { FaRegQuestionCircle } from "react-icons/fa";

function SummaryFaq({ faq }: { faq: SummaryTemplateContent["faq"] }) {
  if (!faq.questions?.length) return null;

  return (
    <section id="summary-faq" className="scroll-mt-24 py-16 sm:py-20">
      <div className="wrapper">
        <SummarySectionHeading eyebrow={faq.eyebrow} title={faq.title} />
        <Accordion
          type="single"
          collapsible
          className="mx-auto mt-10 max-w-2xl space-y-3"
        >
          {faq.questions.map((question) => (
            <AccordionItem
              key={question.question}
              value={question.question}
              className="data-[state=open]:bg-primary-50 data-[state=closed]:bg-primary-50 px-4 transition-all"
            >
              <AccordionTrigger
                className="text-right text-sm font-bold hover:no-underline"
                wrapperClassname="bg-transparent"
                chevronClassname="size-4"
              >
                <div className="flex items-center gap-2">
                  <FaRegQuestionCircle className="fill-secondary" />
                  {question.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-right leading-7 text-slate-600">
                {question.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default SummaryFaq;
