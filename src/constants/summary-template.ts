import type { SummaryTemplateContent } from "@/types/summary-template.types";

export const SUMMARY_HERO_IMAGE_FALLBACK =
  "/assets/templates/summary/hero-student.jpg";

export const SUMMARY_BOOKING_DEFAULTS: SummaryTemplateContent["booking"] = {
  eyebrow: "الاشتراك",
  title: "احجز مكانك وابدأ معانا",
  description: "املأ البيانات وسنتواصل معك لتأكيد الاشتراك وشرح نظام الدراسة.",
  submitLabel: "أكد حجزك المجاني",
  applicantTypes: [
    { label: "طالب", value: "student" },
    { label: "ولي أمر", value: "guardian" },
  ],
  grades: [
    { label: "الصف الأول", value: "first" },
    { label: "الصف الثاني", value: "second" },
    { label: "الصف الثالث", value: "third" },
  ],
};
