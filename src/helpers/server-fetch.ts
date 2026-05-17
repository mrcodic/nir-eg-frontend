// helpers/fetch-server.ts
import "server-only";

import CustomError from "@/lib/customError";
import { FetchOptions, IGetDataOptions } from "@/types/helpers.types";
import { cookies, headers } from "next/headers";
import { buildApiUrl } from "./fetch-utils";
import reactCache from "./reactCache";
import { handleServerFetchError } from "./server-error-handler";
import { extractTenantFromHostServer } from "./server-utils";
import { cache } from "react";

// ---------------------------------------------------------------------------
// Reads the real visitor IP from Next.js incoming request headers.
// x-forwarded-for can be a comma-chain when behind multiple proxies —
// the first entry is always the original client.
// ---------------------------------------------------------------------------
const getClientIp = cache(async (): Promise<string | null> => {
  const h = await headers();

  const ip =
    h.get("cf-connecting-ip") ??
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    h.get("x-real-ip") ??
    null;

  const LOOPBACK = new Set(["::1", "127.0.0.1"]);
  if (!ip || LOOPBACK.has(ip)) return null;

  return ip;
});

export async function fetchServer<T>({
  queryKey: [endpoint],
  auth = false,
  optionalAuth = false,
  cache = "default",
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

    const clientIp = await getClientIp();

    console.log("client ip address ", clientIp);

    const res = await fetch(buildApiUrl(subdomain, endpoint), {
      headers: {
        Accept: "application/json",
        "X-Tenant-Domain": host,
        ...(clientIp
          ? {
              "X-Forwarded-For": clientIp,
              "X-Real-IP": clientIp,
            }
          : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      cache,
      next,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      const message = data?.message ?? "Request failed";
      const code =
        res.status === 401
          ? "UNAUTHORIZED"
          : res.status === 403
            ? "FORBIDDEN"
            : res.status === 404
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
