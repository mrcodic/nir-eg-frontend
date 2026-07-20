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
  type: number;
  first_name: string;
  last_name: string;
  phone: string;
  grade_id: number;
  state_id: number;
  city_id: number;
};

export type SummaryTemplateFeature = {
  title: string;
  description: string;
  icon: string | null;
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
  };
  faq: {
    eyebrow: string;
    title: string;
    questions: SummaryTemplateFaq[];
  };
};
