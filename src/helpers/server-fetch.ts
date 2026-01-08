// helpers/fetch-server.ts
import "server-only";

import CustomError from "@/lib/customError";
import { IGetDataOptions } from "@/types/helpers.types";
import { cookies } from "next/headers";
import { buildApiUrl, FetchOptions } from "./fetch-utils";
import reactCache from "./reactCache";
import { handleServerFetchError } from "./server-error-handler";
import { extractTenantFromHostServer } from "./server-utils";

export async function fetchServer<T>({
  queryKey: [endpoint],
  auth = false,
  cache = "default",
  next,
}: FetchOptions): Promise<T | null> {
  try {
    if (!endpoint || typeof endpoint !== "string") return null;

    const { subdomain, host } = await extractTenantFromHostServer();

    const token = auth ? (await cookies()).get("nir_token")?.value : null;

    if (auth && !token) {
      return handleServerFetchError(
        new CustomError("Unauthenticated", 401),
        endpoint,
      );
    }

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
      const data = await res.json().catch(() => null);
      throw new CustomError(data?.message ?? "Request failed", res.status);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    return handleServerFetchError(error, endpoint as string);
    // if (error?.response?.data?.code === 403 || error?.status === 403) {
    //   console.log("unauth redirect");
    //   redirect("/unauthorized");
    // } else if (error?.status == 401 || error?.response?.data?.code == 410) {
    //   console.log("login redirect");
    //   redirect("/api/delete-session");
    // } else if (error instanceof CustomError) {
    //   console.log("custom error redirect");
    //   throw error;
    // } else {
    //   throw new CustomError(`Failed to fetch data from ${endpoint}`, 500);
    // }
  }
}

export const getServerData = reactCache(
  async <T = any>({
    queryKey: [endpoint],
    next,
    cache,
    isAuth = true,
  }: IGetDataOptions): Promise<T | null> =>
    fetchServer({ queryKey: [endpoint], next, cache, auth: isAuth }),
);
