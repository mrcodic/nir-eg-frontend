import { cookies } from "next/headers";
import "server-only";
import { buildApiUrl, parseError } from "./fetch-utils";
import {
  extractTenantFromHostServer,
  getClientIpForwardingHeaders,
} from "./server-utils";

export async function mutateServer<T = any>(
  endpoint: string,
  body: unknown,
  { auth = false, headers = {}, method = "POST" },
): Promise<T> {
  try {
    const [token, { subdomain, host }, clientIpHeaders] = await Promise.all([
      auth
        ? cookies().then((store) => store.get("nir_token")?.value)
        : undefined,
      extractTenantFromHostServer(),
      getClientIpForwardingHeaders(),
    ]);

    const res = await fetch(buildApiUrl(subdomain, endpoint), {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Domain": host,
        ...clientIpHeaders,
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
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
