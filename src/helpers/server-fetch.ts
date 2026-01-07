// helpers/fetch-server.ts
import "server-only";

import CustomError from "@/lib/customError";
import { IGetDataOptions } from "@/types/helpers.types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { buildApiUrl, FetchOptions } from "./fetch-utils";
import reactCache from "./reactCache";
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
      if (res.status === 401) redirect("/login");
      if (res.status === 403) redirect("/unauthorized");

      const data = await res.json().catch(() => null);
      throw new CustomError(data?.message ?? "Server error", res.status);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    if (error?.response?.data?.code === 403) {
      console.log("unauth redirect");
      redirect("/unAuth");
    } else if (error?.status === 403) {
      console.log("unauth center redirect");
      redirect("/unAuthCenter");
    } else if (error?.status == 401 || error?.response?.data?.code == 410) {
      console.log("login redirect");
      redirect("/api/delete-session");
    } else if (error instanceof CustomError) {
      console.log("custom error redirect");
      throw error;
    } else {
      throw new CustomError(`Failed to fetch data from ${endpoint}`, 500);
    }
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
