import { SUMMARY_BOOKING_DEFAULTS } from "@/constants/summary-template";
import type { SummaryTemplateContent } from "@/types/summary-template.types";
import type {
  LandingPageData,
  LandingPageHeader,
  LandingPageSection,
} from "@/types/tenant.types";

function mapSection(
  section: LandingPageSection,
): SummaryTemplateContent["benefits"] {
  return {
    eyebrow: section.eyebrow,
    title: section.title,
    description: section.description,
    hidden: section.hidden,
    features: section.items.map((item) => ({
      title: item.title,
      description: item.description,
      icon: item.icon,
    })),
  };
}

export function mapSummaryNavigation(
  header: LandingPageHeader,
): SummaryTemplateContent["navigation"] {
  return [
    { label: header.home_label || "الرئيسية", href: "#summary-home" },
    { label: header.features_label || "المميزات", href: "#summary-benefits" },
    { label: header.course_label || "نظام الكورس", href: "#summary-course" },
    { label: header.registration_label || "التسجيل", href: "#summary-booking" },
    { label: header.faq_label || "الأسئلة الشائعة", href: "#summary-faq" },
  ];
}

export function mapSummaryLandingContent(
  data: LandingPageData,
): SummaryTemplateContent {
  return {
    navigation: mapSummaryNavigation(data.header),
    hero: {
      eyebrow: data.hero.badge,
      title: data.hero.title,
      description: data.hero.description,
      image: data.hero.image ?? "/assets/bg/hero-student.jpg",
      hidden: data.hero.hidden,
      primaryAction: {
        label: data.hero.primary_button_text,
        href: "#summary-booking",
      },
      secondaryAction: {
        label: data.hero.secondary_button_text,
        href: data.hero.secondary_button_url || "#summary-footer",
      },
    },
    benefits: mapSection(data.features),
    course: mapSection(data.course),
    booking: {
      ...SUMMARY_BOOKING_DEFAULTS,
    },
    faq: {
      eyebrow: data.faq.eyebrow,
      title: data.faq.title,
      hidden: data.faq.hidden,
      questions: data.faq.items.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
    },
  };
}
