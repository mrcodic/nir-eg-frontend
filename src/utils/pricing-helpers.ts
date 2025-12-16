import { ApiPricingPlan, PlanFeatures } from "@/types/pricing-api.types";

export const FEATURE_LABELS: Record<keyof PlanFeatures, string> = {
  max_classrooms: "فصول دراسية",
  max_students: "طلاب",
  max_teachers: "معلمين",
  storage_gb: "جيجابايت مساحة تخزين",
  live_minutes: "دقيقة بث مباشر",
  whatsapp_quota: "رسالة واتساب",
  custom_domain_enabled: "نطاق مخصص",
  parent_portal_enabled: "بوابة ولي الأمر",
  assignments_enabled: "الواجبات",
  question_bank_enabled: "بنك الأسئلة",
  exam_randomization: "نماذج اختبارات عشوائية",
  gradebook_export: "تصدير درجات الطلاب",
  api_access: "الربط البرمجي (API)",
  analytics_pro: "تحليلات متقدمة",
  certificate_generator: "منشئ الشهادات",
};

const FEATURE_KEYS: Array<keyof PlanFeatures> = [
  "max_students",
  "max_classrooms",
  "max_teachers",
  "storage_gb",
  "live_minutes",
  "whatsapp_quota",
  "custom_domain_enabled",
  "parent_portal_enabled",
  "assignments_enabled",
  "question_bank_enabled",
  "exam_randomization",
  "gradebook_export",
  "analytics_pro",
  "certificate_generator",
  "api_access",
];

export const formatFeature = (
  key: keyof PlanFeatures,
  value: PlanFeatures[keyof PlanFeatures]
): string | null => {
  if (typeof value === "boolean") {
    return value ? FEATURE_LABELS[key] : null;
  }
  if (typeof value === "number") {
    // If value is -1 or similar for unlimited, we might need to handle it.
    // But assuming positive numbers for now.
    if (value === 0) return null;
    return `${value} ${FEATURE_LABELS[key]}`;
  }
  return null;
};

export const getPlanFeaturesList = (features: PlanFeatures): string[] => {
  return FEATURE_KEYS.map((key) => formatFeature(key, features[key])).filter(
    (f): f is string => f !== null
  );
};

export const isPlanFeatured = (
  plan: ApiPricingPlan,
  index: number,
  totalPlans: number
): boolean => {
  // Only apply featured styling if there are exactly 3 plans
  if (totalPlans !== 3) return false;

  if (plan.is_main) return true;

  // Fallback logic if no plan is explicitly featured
  if (index === 1) return true;

  return false;
};
