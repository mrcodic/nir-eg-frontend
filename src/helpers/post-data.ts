// helpers/mutate-client.ts
"use client";

import Cookies from "js-cookie";
import { cookies } from "next/headers";
import { buildApiUrl, extractTenantFromHost, parseError } from "./fetch-utils";

export async function mutateClient<T>(
  endpoint: string,
  body: unknown,
  auth = false,
): Promise<T> {
  try {
    const isClient = typeof window !== "undefined";
    const token = auth
      ? isClient
        ? Cookies.get("nir_token")
        : (await cookies()).get("nir_token")?.value
      : undefined;

    const { subdomain, host } = await extractTenantFromHost();

    const res = await fetch(buildApiUrl(subdomain, endpoint), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Domain": host,
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!res.ok) {
      await parseError(res);
    }

    return res.json();
  } catch (error) {
    console.log("post data error ", endpoint, error);
    throw error;
  }
}
