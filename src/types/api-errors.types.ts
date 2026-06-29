import { AUTH_ERROR_CODES, TENANT_ERROR_CODES } from "@/constants/error-codes";

export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

export type TenantErrorCode =
  (typeof TENANT_ERROR_CODES)[keyof typeof TENANT_ERROR_CODES];

export type ApiErrorPayload<TData = unknown> = {
  status: boolean;
  message: string;
  code?: string;
  data?: TData;
  errors?: Record<string, string[]> | null;
};
