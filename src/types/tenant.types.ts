export interface TenantSettings {
  id: string; // UUID
  owner_user_id: number;
  name: string;
  slug: string;
  status: number;
  plan_id: number;
  trial_ends_at: string;
  meta: Record<string, unknown> | null;
  brand_name: string;
  legal_name: string;
  expected_students: number;
  heard_about_us: string;
  notes: string;
  referral_code: string | null;
  site_name: string;
  landing_template: string;
  primary_color: string;
  data: Record<string, unknown> | null;
  domain_type: "subdomain" | "domain";
  created_at: string;
  updated_at: string;
}
