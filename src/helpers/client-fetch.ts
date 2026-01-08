"use client";

import { IGetDataOptions } from "@/types/helpers.types";
import Cookies from "js-cookie";
import { handleClientFetchError } from "./client-error-handler";
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
  if (!endpoint || typeof endpoint !== "string") return null;

  const { subdomain, host } = extractTenantFromHost();

  const token = auth ? Cookies.get("nir_token") : null;

  if (auth && !token) {
    return handleClientFetchError({ status: 401 }, endpoint);
  }

  try {
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
      throw await parseError(res);
    }

    return res.json();
  } catch (error) {
    console.error(
      `Error in fetcher client for ${endpoint}:`,
      error,
      error.status,
    );
    handleClientFetchError(error, endpoint);
  }
}

export const getClientPrivateData = async <T = any>({
  queryKey: [endpoint],
  next,
  cache,
}: IGetDataOptions): Promise<T | null> =>
  fetchClient({ queryKey: [endpoint], next, cache, auth: true });

// for client and server
export const getPublicData = async <T = any>({
  queryKey: [endpoint],
  next,
  cache,
  isAuth = false,
}: IGetDataOptions): Promise<T | null> =>
  fetchClient({ queryKey: [endpoint], next, cache, auth: isAuth });
