"use client";

import { FaqSection } from "@/types/landing.types";
import { ArrowUpLeft } from "lucide-react";
import Link from "next/link";
import FAQAccordion from "../FAQAccordion";

export default function FAQSection({ data }: { data: FaqSection }) {
  if (!data?.items?.length) return null;

  const displayedItems = data.items.slice(0, 6);
  const hasMoreItems = data.items.length > 6;

  return (
    <section className="wrapper bg-background w-full relative text-center py-8 space-y-6 bg-[url('/assets/backgrounds/bg-vector.png')] ">
      {/* <Image className="z-1 object-cover" fill src="/assets/backgrounds/bg-vector.png" alt="" /> */}

      <h3 className="text-32 font-bold">
        يمكنك ان تجد{" "}
        <span className="text-primary-800 drop-shadow-text    ">
          {" "}
          الاجابات{" "}
        </span>
        لأسئلتك هنا
      </h3>

      <div className=" max-w-3xl mx-auto relative z-2">
        <FAQAccordion faqs={displayedItems} />

        {hasMoreItems && (
          <Link
            href="/faq"
            className="mx-auto w-fit mt-6 max-w-[760px] text-primary-800 flex items-center gap-2 border border-primary-800 px-4 py-2 rounded-xl cursor-pointer hover:bg-primary-800 hover:text-white transition-all"
          >
            عرض المزيد <ArrowUpLeft />
          </Link>
        )}
      </div>
    </section>
  );
}
