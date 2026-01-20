// helpers/server-error-handler.ts
import CustomError from "@/lib/customError";
import { redirect } from "next/navigation";
import "server-only";
import { getAuthFailureStrategy } from "./auth-policy";

export function handleServerFetchError(
  error: unknown,
  endpoint: string,
): never | null {
  const status =
    error instanceof CustomError ? error.status : (error as any)?.status;

  const strategy = getAuthFailureStrategy(endpoint);

  console.log("server -> ", endpoint, status);

  if (status === 401) {
    if (strategy === "silent-null") {
      return null;
    }

    redirect("/login");
  }

  if (status === 403) {
    console.log("unauth redirect");
    redirect("/unauthorized");
  }

  if (status === 429) {
    redirect("/ErrorPage?message=لقد تجاوزت الحد المسموح به من الطلبات");
  }

  if (error instanceof CustomError) {
    throw error;
  }

  throw new CustomError("Unexpected server error", 500);
}
