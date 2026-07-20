export type SummaryTemplateIcon =
  | "book"
  | "chart"
  | "file"
  | "message"
  | "users"
  | "video";

export type SummaryTemplateLink = {
  label: string;
  href: string;
};

export type SummaryTemplateOption = {
  label: string;
  value: string;
};

export type SummaryTemplateAction = {
  label: string;
  href: string;
};

export type SummaryBookingFormValues = {
  applicantType: "student" | "guardian";
  firstName: string;
  lastName: string;
  phone: string;
  grade: "first" | "second" | "third";
};

export type SummaryTemplateFeature = {
  title: string;
  description: string;
  icon: SummaryTemplateIcon;
};

export type SummaryTemplateFaq = {
  question: string;
  answer: string;
};

export type SummaryTemplateContent = {
  navigation: SummaryTemplateLink[];
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    primaryAction: SummaryTemplateAction;
    secondaryAction: SummaryTemplateAction;
  };
  benefits: {
    eyebrow: string;
    title: string;
    description: string;
    features: SummaryTemplateFeature[];
  };
  course: {
    eyebrow: string;
    title: string;
    description: string;
    features: SummaryTemplateFeature[];
  };
  booking: {
    eyebrow: string;
    title: string;
    description: string;
    submitLabel: string;
    applicantTypes: SummaryTemplateOption[];
    grades: SummaryTemplateOption[];
  };
  faq: {
    eyebrow: string;
    title: string;
    questions: SummaryTemplateFaq[];
  };
};
