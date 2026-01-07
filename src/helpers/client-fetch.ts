"use client";

import { clientGetErrorhandler } from "@/lib/client-get-errorhandler";
import { IGetDataOptions } from "@/types/helpers.types";
import Cookies from "js-cookie";
import {
  buildApiUrl,
  extractTenantFromHost,
  FetchOptions,
  parseError,
} from "./fetch-utils";
import reactCache from "./reactCache";

export async function fetchClient<T>({
  queryKey: [endpoint],
  auth = false,
  cache = "default",
  next,
}: FetchOptions): Promise<T | null> {
  try {
    if (!endpoint || typeof endpoint !== "string") return null;

    const { subdomain, host } = extractTenantFromHost();

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
      await parseError(res);
    }

    return res.json();
  } catch (error) {
    console.error(
      `Error in fetcher client for ${endpoint}:`,
      error,
      error.status,
    );
    clientGetErrorhandler(error);
  }
}

export const getClientPrivateData = reactCache(
  async <T = any>({
    queryKey: [endpoint],
    next,
    cache,
  }: IGetDataOptions): Promise<T | null> =>
    fetchClient({ queryKey: [endpoint], next, cache, auth: true }),
);

// for client and server
export const getPublicData = reactCache(
  async <T = any>({
    queryKey: [endpoint],
    next,
    cache,
    isAuth = false,
  }: IGetDataOptions): Promise<T | null> =>
    fetchClient({ queryKey: [endpoint], next, cache, auth: isAuth }),
);
