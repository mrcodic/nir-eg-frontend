import { isAxiosError } from "axios";

import type { ApiErrorPayload } from "@/types/api-errors.types";

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (!isAxiosError<ApiErrorPayload>(error)) return fallbackMessage;

  const message = error.response?.data?.message;

  return typeof message === "string" && message.trim()
    ? message
    : fallbackMessage;
}
