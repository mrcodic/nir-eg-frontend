// helpers/server-error-handler.ts
import CustomError from "@/lib/customError";
import "server-only";
import { getAuthFailureStrategy } from "../auth-policy";
import { safeRedirectServer } from "../safe-redirect-server";

export async function handleServerFetchError({
  error,
  endpoint,
}: {
  error: unknown;
  endpoint: string;
}): Promise<never | null> {
  const appError =
    error instanceof CustomError
      ? error
      : new CustomError(
          "Unexpected server error",
          (error as any)?.status ?? 500,
          "UNEXPECTED",
        );

  const strategy = getAuthFailureStrategy(endpoint);

  console.log("server ->", endpoint, appError.status, appError.code);

  if (appError.code === "UNAUTHORIZED" || appError.code === "FORBIDDEN") {
    if (strategy === "silent-null") {
      return null;
    }

    if (appError.code === "UNAUTHORIZED") {
      return await safeRedirectServer("/login");
    }
    return await safeRedirectServer("/unauthorized");
  }

  if (appError.code === "RATE_LIMITED") {
    return await safeRedirectServer(
      "/ErrorPage?message=لقد تجاوزت الحد المسموح به من الطلبات",
    );
  }

  if (appError.code === "NOT_FOUND") {
    return null;
  }

  throw appError;
}
