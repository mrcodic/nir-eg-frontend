"use client";

import { getQueryClient } from "@/lib/queryClient";
import Cookies from "js-cookie";
import { getAuthFailureStrategy } from "../auth-policy";

function safeRedirect(path: string) {
  if (typeof window === "undefined") return;

  const current = window.location.pathname;

  const cleanedPath = path.split("?")?.[0] ?? path;

  if (current === cleanedPath) return;

  window.location.href = path;
}

export function handleClientFetchError(error: any, endpoint: unknown): null {
  if (typeof endpoint !== "string") return null;
  const status = error?.status ?? error?.response?.status;
  const strategy = getAuthFailureStrategy(endpoint);

  if (status === 401) {
    Cookies.remove("nir_token");
    if (endpoint === "/students/profile") {
      getQueryClient().removeQueries({ queryKey: ["/students/profile"] });
    }
    if (strategy === "silent-null") return null;
    safeRedirect("/login");
    return null;
  }

  if (status === 403) {
    // console.log("unauthorized", error);
    if (strategy === "silent-null") return null;
    if (endpoint === "settings/books" && window?.location.pathname !== "/store")
      return null;
    safeRedirect("/unauthorized");
    return null;
  }

  if (status === 429) {
    safeRedirect("/ErrorPage?message=لقد تجاوزت الحد المسموح به من الطلبات");
    return null;
  }

  if (status === 404) {
    return null;
  }

  throw error;
}
