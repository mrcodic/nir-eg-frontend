import { cookies } from "next/headers";
import "server-only";
import { buildApiUrl, parseError } from "./fetch-utils";
import { extractTenantFromHostServer } from "./server-utils";

export async function mutateServer<T = any>(
  endpoint: string,
  body: unknown,
  { auth = false, headers = {}, method = "POST" },
): Promise<T> {
  try {
    const token = auth ? (await cookies()).get("nir_token")?.value : undefined;

    const { subdomain, host } = await extractTenantFromHostServer();

    const res = await fetch(buildApiUrl(subdomain, endpoint), {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Domain": host,
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
