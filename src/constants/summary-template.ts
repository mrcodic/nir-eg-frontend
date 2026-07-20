import type { SummaryTemplateContent } from "@/types/summary-template.types";

export const SUMMARY_BOOKING_DEFAULTS: SummaryTemplateContent["booking"] = {
  eyebrow: "الاشتراك",
  title: "احجز مكانك وابدأ معانا",
  description: "املأ البيانات وسنتواصل معك لتأكيد الاشتراك وشرح نظام الدراسة.",
  submitLabel: "أكد حجزك المجاني",
  applicantTypes: [
    { label: "طالب", value: "1" },
    { label: "ولي أمر", value: "0" },
  ],
};
