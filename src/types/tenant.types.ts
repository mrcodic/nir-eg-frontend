export enum Templates {
  LANDING_V1 = "landing-v1",
  LANDING_V2 = "landing-v2",
  LANDING_V3 = "landing-v3",
  SUMMARY_LANDING = "summry_landing",
}

export interface TenantFeatures {
  center_system: boolean;
  payment_methods_coupons: boolean;
  community_system: boolean;
  student_gradebook: boolean;
  points_system: boolean;
  book_store: boolean;
  promo_code: boolean;
  ai_chatbot: boolean;
  quizzes: boolean;
}

export interface TenantSettings {
  id: string;
  owner_user_id: number;

  name: string;
  slug: string;
  status: number;

  plan_id: number | null;
  trial_ends_at: string | null;

  brand_name: string | null;
  legal_name: string | null;
  site_name: string;

  landing_template: Templates;
  primary_color: string;

  expected_students: number;
  heard_about_us: string;
  notes: string;
  referral_code: string | null;

  domain_type: "subdomain" | "domain";

  logo: string;
  favicon: string;
  cover: string | null;

  features: TenantFeatures;

  created_at: string;
  updated_at: string;
}

export type SocialItem = {
  name: string | null;
  number: string | null;
  link: string | null;
  image: string | null;
};

export interface TenantLandingResponse {
  status: boolean;

  tenant: {
    id: string;
    brand_name: string;
    site_name: string;
    landing_template: Templates;
    primary_color: string;
  };

  active_template: Templates;

  data: {
    main: {
      section_title: string;
      title: string;
      description: string;
      image: string;
    };
    why?: {
      section_title: string;
      items: Array<{
        title: string;
        description: string;
        image: string;
      }>;
    };
    start?: {
      section_title: string;
      image1: string;
      image2: string;
    };
    features?: {
      items: Array<{
        text: string;
        image: string;
      }>;
    };
    social?: {
      section_title: string;
      items: SocialItem[];
    };
    numbers?: {
      section_title: string;
      items: Array<{
        number: string | null;
        title: string | null;
        image: string | null;
      }>;
    };
  };
}

export interface UserTenant {
  domain: string;
  domain_type: string;
  enrolled_at: string;
  last_accessed_at: string | null;
  logo: string | null;
  name: string;
  primary_color: string;
  slug: string;
  source: string;
  status: string;
  tenant_id: string;
  tenant_status: "active" | null;
  tenant_user_id: number;
}

export type SwitchTenantActiveTenant = {
  id: string;
  name: string;
  slug: string;
  brand_name: string | null;
  site_name: string | null;
  primary_color: string | null;
  domain_type: "subdomain" | "domain";
  status: number;
};

export type SwitchTenantResponse = {
  status: boolean;
  active_tenant?: SwitchTenantActiveTenant;
  message?: string;
};

export interface LandingSummaryResponse {
  status: boolean;
  active: boolean;
  data: LandingPageData;
}

export interface LandingPageData {
  header: LandingPageHeader;
  hero: LandingPageHero;
  features: LandingPageSection;
  course: LandingPageSection;
  faq: LandingPageFaq;
}

export interface LandingPageHeader {
  home_label: string;
  features_label: string;
  course_label: string;
  faq_label: string;
  registration_label: string;
  button_text: string;
}

export interface LandingPageHero {
  badge: string;
  title: string;
  description: string;
  image: string | null;
  primary_button_text: string;
  secondary_button_text: string;
  secondary_button_url: string;
}

export interface LandingPageSection {
  eyebrow: string;
  title: string;
  description: string;
  items: LandingPageSectionItem[];
}

export interface LandingPageSectionItem {
  title: string;
  description: string;
  icon: string | null;
}

export interface LandingPageFaq {
  eyebrow: string;
  title: string;
  items: LandingPageFaqItem[];
}

export interface LandingPageFaqItem {
  question: string;
  answer: string;
}
