"use client";

import { clientGetErrorhandler } from "@/lib/client-get-errorhandler";
import Cookies from "js-cookie";
import {
  buildApiUrl,
  extractTenantFromHost,
  FetchOptions,
  parseError,
} from "./fetch-utils";

export async function fetchClient<T>({
  queryKey: [endpoint],
  auth = false,
  cache = "default",
  next,
}: FetchOptions): Promise<T | null> {
  try {
    if (!endpoint || typeof endpoint !== "string") return null;

    const { subdomain, host } = await extractTenantFromHost();

    const token = auth ? Cookies.get("nir_token") : null;

    if (auth && !token) return null;

    const res = await fetch(buildApiUrl(subdomain, endpoint), {
      headers: {
        Accept: "application/json",
        "X-Tenant-Domain": host,
        ...(auth ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      cache,
      next,
    });

    if (!res.ok) {
      parseError(res);
    }

    return res.json();
  } catch (error) {
    clientGetErrorhandler(error);
  }
}
