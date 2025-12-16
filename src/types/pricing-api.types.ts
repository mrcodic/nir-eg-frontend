export interface PlanFeatures {
  max_classrooms: number;
  max_students: number;
  max_teachers: number;
  storage_gb: number;
  live_minutes: number;
  whatsapp_quota: number;
  custom_domain_enabled: boolean;
  parent_portal_enabled: boolean;
  assignments_enabled: boolean;
  question_bank_enabled: boolean;
  exam_randomization: boolean;
  gradebook_export: boolean;
  api_access: boolean;
  analytics_pro: boolean;
  certificate_generator: boolean;
}

export interface IPricingPlan {
  id: number;
  code: string;
  name: string;
  seats_included: number;
  price_month: number;
  price_year: number;
  overage_per_seat: number;
  free_trial: string;
  features: PlanFeatures;
  created_at: string;
  is_main: boolean;
}

export interface PricingPlansApiResponse<T> {
  status_code: number;
  status: boolean;
  data: T;
  message: string;
}
