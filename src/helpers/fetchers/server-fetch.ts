// helpers/fetch-server.ts
import "server-only";

import CustomError from "@/lib/customError";
import { FetchOptions, IGetDataOptions } from "@/types/helpers.types";
import { cookies } from "next/headers";
import reactCache from "../reactCache";
import { buildApiUrl } from "./fetch-utils";
import { handleServerFetchError } from "./server-error-handler";
import {
  extractTenantFromHostServer,
  getClientIpForwardingHeaders,
} from "./server-utils";

export async function fetchServer<T>({
  queryKey: [endpoint],
  auth = false,
  optionalAuth = false,
  cache = "no-store",
  next,
}: FetchOptions): Promise<T | null> {
  const { subdomain, host } = await extractTenantFromHostServer();
  try {
    if (!endpoint || typeof endpoint !== "string") return null;
    if (!subdomain) {
      console.error(
        "[server-fetch] null subdomain for host:",
        host,
        "endpoint:",
        endpoint,
      );
      return null;
    }

    const token =
      auth || optionalAuth ? (await cookies()).get("nir_token")?.value : null;

    if (auth && !token && !optionalAuth) {
      return handleServerFetchError({
        error: new CustomError("Unauthenticated", 401, "UNAUTHORIZED"),
        endpoint,
      });
    }

    const clientIpHeaders = await getClientIpForwardingHeaders();

    const res = await fetch(buildApiUrl(subdomain, endpoint), {
      headers: {
        Accept: "application/json",
        "X-Tenant-Domain": host,
        ...clientIpHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      cache,
      next: {
        ...next,
        tags: [endpoint, ...(next?.tags ?? [])],
      },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      const message = data?.message ?? "Request failed";
      const code =
        res.status === 401
          ? "UNAUTHORIZED"
          : res.status === 403
            ? "FORBIDDEN"
            : res.status === 404 || res.status === 400
              ? "NOT_FOUND"
              : res.status === 429
                ? "RATE_LIMITED"
                : "UNEXPECTED";
      console.log("server-fetch error ", message);
      throw new CustomError(message, res.status, code);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    return handleServerFetchError({
      error,
      endpoint: endpoint as string,
    });
  }
}

export const getServerData = reactCache(
  async <T = any>({
    queryKey: [endpoint],
    next,
    cache,
    isAuth = true,
    optionalAuth = false,
  }: IGetDataOptions): Promise<T | null> =>
    fetchServer({
      queryKey: [endpoint],
      next,
      cache,
      auth: isAuth,
      optionalAuth,
    }),
);
