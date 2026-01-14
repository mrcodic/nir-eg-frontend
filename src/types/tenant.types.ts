export type Templates = "landing-v1" | "landing-v2" | "landing-v3";

export interface TenantSettings {
  id: string; // UUID
  owner_user_id: number;

  name: string;
  slug: string;
  status: number;

  plan_id: number | null;
  trial_ends_at: string;

  brand_name: string;
  legal_name: string;
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
  cover: string;

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
