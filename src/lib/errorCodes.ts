// Typed error codes for all expected operational errors.
// Add new codes here when introducing new error conditions.
export type ErrorCode =
  | "TENANT_NOT_FOUND"
  | "TENANT_SUSPENDED"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_SUBSCRIBED"
  | "RATE_LIMITED"
  | "UNEXPECTED";

export interface ErrorMeta {
  /** User-facing Arabic title */
  title: string;
  /** User-facing Arabic description */
  description: string;
}

export const ERROR_MAP: Record<ErrorCode, ErrorMeta> = {
  TENANT_NOT_FOUND: {
    title: "الموقع غير موجود",
    description:
      "الموقع التعليمي الذي تحاول الوصول إليه غير موجود أو لم يتم إنشاؤه بعد.",
  },
  TENANT_SUSPENDED: {
    title: "الموقع موقوف",
    description:
      "هذا الموقع التعليمي موقوف حاليًا. يرجى التواصل مع مدير الموقع أو دعم NIR EDU.",
  },
  UNAUTHORIZED: {
    title: "غير مصرح",
    description: "يرجى تسجيل الدخول للوصول إلى هذه الصفحة.",
  },
  FORBIDDEN: {
    title: "ممنوع",
    description: "ليس لديك صلاحية للوصول إلى هذا المحتوى.",
  },
  NOT_SUBSCRIBED: {
    title: "غير مشترك",
    description: "يجب الاشتراك في هذا الكورس للوصول إلى المحتوى.",
  },
  RATE_LIMITED: {
    title: "طلبات كثيرة",
    description: "لقد تجاوزت الحد المسموح به من الطلبات. يرجى المحاولة لاحقًا.",
  },
  UNEXPECTED: {
    title: "حدث خطأ غير متوقع",
    description:
      "نعتذر، حدثت مشكلة أثناء تحميل الصفحة. يمكنك المحاولة مرة أخرى أو التواصل معنا.",
  },
};

export function getErrorMeta(code: ErrorCode | undefined): ErrorMeta {
  return ERROR_MAP[code ?? "UNEXPECTED"] ?? ERROR_MAP["UNEXPECTED"];
}
