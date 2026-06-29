export type Templates = "landing-v1" | "landing-v2" | "landing-v3";

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
  tenant_status: number;
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

export type DesktopTenantRecord = {
  slug: string;
  host: string;
  domain_type: "subdomain" | "domain";
  name: string;
  brand_name: string | null;
  site_name: string;
  logo: string;
  primary_color: string;
  last_used_at: string;
};

export type TenantInviteResolutionResponse = {
  status: "valid" | "invalid" | string;
  tenant?: {
    id: string;
    name: string;
    slug: string;
    primary_color: string;
    domain?: string | null;
    domain_type?: "subdomain" | "domain";
  } | null;
  invite?: {
    code: string;
    type: string;
    expires_at: string | null;
    max_uses: number | null;
    used_count: number;
  } | null;
};
