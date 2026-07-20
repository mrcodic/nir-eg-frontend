import { SUMMARY_BOOKING_DEFAULTS } from "@/constants/summary-template";
import type {
  SummaryTemplateContent,
  SummaryTemplateIcon,
} from "@/types/summary-template.types";
import type {
  LandingPageData,
  LandingPageHeader,
  LandingPageSection,
} from "@/types/tenant.types";

const summaryIcons: SummaryTemplateIcon[] = [
  "video",
  "chart",
  "book",
  "file",
  "users",
  "message",
];

function isSummaryTemplateIcon(
  icon: string | null,
): icon is SummaryTemplateIcon {
  return summaryIcons.includes(icon as SummaryTemplateIcon);
}

function mapSection(
  section: LandingPageSection,
): SummaryTemplateContent["benefits"] {
  return {
    eyebrow: section.eyebrow,
    title: section.title,
    description: section.description,
    features: section.items.map((item, index) => ({
      title: item.title,
      description: item.description,
      icon: isSummaryTemplateIcon(item.icon)
        ? item.icon
        : summaryIcons[index % summaryIcons.length],
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
      image: data.hero.image ?? "/assets/templates/summary/hero-student.jpg",
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
      questions: data.faq.items.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
    },
  };
}
