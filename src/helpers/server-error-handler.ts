// helpers/server-error-handler.ts
import CustomError from "@/lib/customError";
import { redirect } from "next/navigation";
import "server-only";
import { getAuthFailureStrategy } from "./auth-policy";

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
      redirect("/login");
    }
    redirect("/unauthorized");
  }

  if (appError.code === "RATE_LIMITED") {
    redirect("/ErrorPage?message=لقد تجاوزت الحد المسموح به من الطلبات");
  }

  throw appError;
}
