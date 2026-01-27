import { PlanFeatures } from "@/types/pricing-api.types";

export interface FeatureDefinition {
  key: keyof PlanFeatures | string;
  label: string;
  type: "boolean" | "number";
  category?: "basic" | "advanced" | "limits";
  description?: string;
}

// Comprehensive feature name mapping from English to Arabic
export const FEATURE_LABELS: Record<string, string> = {
  // SMS & Communication
  whatsapp_quota: "إرسال رسائل نصية قصيرة (SMS) إلى المستخدمين",

  // Account & Portal Features
  parent_portal_enabled:
    "حساب ولي الأمر (Parents Account) + تقارير أولياء الأمور (Parents Reporting)",

  // Permissions & Security
  roles_permissions: "إدارة الأدوار والصلاحيات (Roles & Permissions)",

  // Attendance & Scheduling
  attendance_tracking: "سجلات تسجيل الدخول",

  // Device Management
  login_restrictions: "تقييد عدد الأجهزة (Restrictions - No. Devices)",

  // Classroom Management
  max_classrooms: "إدارة الفصول (Classrooms)",

  // Content & Materials
  recorded_videos:
    "فيديوهات مسجلة + مواد الفصول (Recorded videos + Room material)",

  // Assessments
  quizzes: "اختبارات في كل وحدة (Quizzes)",
  gradebook_export: "سجل الدرجات للطلاب (Student Gradebook)",
  question_bank_enabled: "بنك الأسئلة (Questions Bank)",
  exam_randomization: "عشوائية الاختبارات",

  // Analytics & Reporting
  analytics_pro: "تحليلات متقدمة",

  // Additional Features
  assignments_enabled: "الواجبات والتكليفات",
  custom_domain_enabled: "نطاق مخصص خاص",
  certificate_generator: "مولد الشهادات",
  api_access: "الوصول إلى API",

  // Limits
  max_students: "الحد الأقصى للطلاب",
  max_teachers: "الحد الأقصى للمعلمين",
  storage_gb: "المساحة التخزينية (GB)",
  live_minutes: "دقائق البث المباشر",
};

// Define features in display order matching the screenshot
export const FEATURES_IN_ORDER: FeatureDefinition[] = [
  {
    key: "whatsapp_quota",
    label: FEATURE_LABELS.whatsapp_quota,
    type: "number",
    category: "basic",
  },
  {
    key: "parent_portal_enabled",
    label: FEATURE_LABELS.parent_portal_enabled,
    type: "boolean",
    category: "advanced",
  },
  {
    key: "roles_permissions",
    label: FEATURE_LABELS.roles_permissions,
    type: "boolean",
    category: "advanced",
  },
  {
    key: "attendance_tracking",
    label: FEATURE_LABELS.attendance_tracking,
    type: "boolean",
    category: "basic",
  },
  {
    key: "login_restrictions",
    label: FEATURE_LABELS.login_restrictions,
    type: "boolean",
    category: "advanced",
  },
  {
    key: "max_classrooms",
    label: FEATURE_LABELS.max_classrooms,
    type: "number",
    category: "limits",
  },
  {
    key: "recorded_videos",
    label: FEATURE_LABELS.recorded_videos,
    type: "boolean",
    category: "basic",
  },
  {
    key: "quizzes",
    label: FEATURE_LABELS.quizzes,
    type: "boolean",
    category: "basic",
  },
  {
    key: "gradebook_export",
    label: FEATURE_LABELS.gradebook_export,
    type: "boolean",
    category: "basic",
  },
  {
    key: "question_bank_enabled",
    label: FEATURE_LABELS.question_bank_enabled,
    type: "boolean",
    category: "advanced",
  },
];

// Helper to get feature value from plan
export function getFeatureValue(
  planFeatures: PlanFeatures,
  featureKey: string,
): boolean {
  const featureKeyMap: Record<string, keyof PlanFeatures> = {
    roles_permissions: "api_access",
    attendance_tracking: "analytics_pro",
    login_restrictions: "custom_domain_enabled",
    recorded_videos: "assignments_enabled",
    quizzes: "exam_randomization",
  };

  const actualKey = (featureKeyMap[featureKey] ??
    featureKey) as keyof PlanFeatures;

  const value = planFeatures[actualKey];

  if (typeof value === "number") {
    return value > 0;
  }

  return Boolean(value);
}

// Format number values for display
export function formatFeatureValue(
  value: boolean | number,
  type: "boolean" | "number",
): string {
  if (type === "boolean") {
    return value ? "✓" : "✗";
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat("ar-EG").format(value);
  }

  return "-";
}
