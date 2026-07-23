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
    hidden: boolean;
    image: string;
    primaryAction: SummaryTemplateAction;
    secondaryAction: SummaryTemplateAction;
  };
  benefits: {
    eyebrow: string;
    title: string;
    description: string;
    hidden: boolean;

    features: SummaryTemplateFeature[];
  };
  course: {
    eyebrow: string;
    title: string;
    description: string;
    hidden: boolean;

    features: SummaryTemplateFeature[];
  };
  booking: {
    eyebrow: string;
    title: string;
    description: string;
    submitLabel: string;
    typeLabel: string;
    firstNameLabel: string;
    lastNameLabel: string;
    phoneLabel: string;
    gradeLabel: string;

    applicantTypes: SummaryTemplateOption[];
  };
  faq: {
    eyebrow: string;
    title: string;
    hidden: boolean;

    questions: SummaryTemplateFaq[];
  };
};
