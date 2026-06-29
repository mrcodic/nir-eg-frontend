// Typed error codes for all expected operational errors.
// Add new codes here when introducing new error conditions.

/** Page-level errors — abort navigation and render a full error UI. */
export type PageErrorCode =
  | "TENANT_NOT_FOUND"
  | "TENANT_SUSPENDED"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "NOT_SUBSCRIBED"
  | "RATE_LIMITED"
  | "UNEXPECTED";

/**
 * Action-level errors — shown as a toast or inline message.
 * The page continues to work normally.
 * Key: add a new member here + a matching entry in ERROR_MAP.
 */
export type ActionErrorCode =
  | "VIDEO_BANDWIDTH_EXCEEDED"  // HTTP 403 + API code 410
  | "STORAGE_BANDWIDTH_EXCEEDED" // HTTP 403 + API code 415
  | "UNEXPECTED_ACTION";          // Generic fallback for action-level errors

export type ErrorCode = PageErrorCode | ActionErrorCode;

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
  NOT_FOUND: {
    title: "غير موجود",
    description: "المحتوى الذي تبحث عنه غير موجود أو تم حذفه.",
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
  VIDEO_BANDWIDTH_EXCEEDED: {
    title: "تجاوز سعة الفيديو",
    description: "قمت باستهلاك السعة المحددة لمشاهدة الفيديوهات.",
  },
  STORAGE_BANDWIDTH_EXCEEDED: {
    title: "تجاوز سعة التخزين",
    description: "قمت باستهلاك السعة المحددة للتخزين.",
  },
  UNEXPECTED_ACTION: {
    title: "حدث خطأ",
    description: "حدث خطأ، حاول مرة أخرى.",
  },
};

export function getErrorMeta(code: ErrorCode | undefined): ErrorMeta {
  return ERROR_MAP[code ?? "UNEXPECTED"] ?? ERROR_MAP["UNEXPECTED"];
}

/**
 * Resolves an action-level API error (HTTP status + business code)
 * to its ErrorMeta. Falls back to UNEXPECTED if the combination is unknown.
 *
 * Usage:
 *   const meta = getActionErrorMeta(e.response?.status, e.response?.data?.code);
 *   toast({ description: meta.description });
 */
export function getActionErrorMeta(
  httpStatus: number | undefined,
  apiCode: number | undefined,
): ErrorMeta {
  if (httpStatus === 403) {
    if (apiCode === 410) return ERROR_MAP["VIDEO_BANDWIDTH_EXCEEDED"];
    if (apiCode === 415) return ERROR_MAP["STORAGE_BANDWIDTH_EXCEEDED"];
  }
  return ERROR_MAP["UNEXPECTED_ACTION"];
}
