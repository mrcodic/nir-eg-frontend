"use client";

import Cookies from "js-cookie";
import { getAuthFailureStrategy } from "./auth-policy";
import { safeRedirect } from "./fetch-utils";

export function handleClientFetchError(error: any, endpoint: unknown): null {
  if (typeof endpoint !== "string") return null;
  const status = error?.status ?? error?.response?.status;
  const strategy = getAuthFailureStrategy(endpoint);

  console.log(endpoint, status);

  if (status === 401) {
    Cookies.remove("nir_token");
    if (strategy === "silent-null") return null;
    safeRedirect("/login");
    return null;
  }

  if (status === 403) {
    console.log("unauthorized", error);
    if (strategy === "silent-null") return null;
    safeRedirect("/unauthorized");
    return null;
  }

  if (status === 429) {
    safeRedirect("/ErrorPage?message=لقد تجاوزت الحد المسموح به من الطلبات");
    return null;
  }

  throw error;
}
