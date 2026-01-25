import axios from "axios";
import Cookies from "js-cookie";
import { buildApiUrl, extractTenantFromHost } from "./fetch-utils";

export async function mutateClient<T = any>(
  endpoint: string,
  {
    body,
    auth = false,
    headers,
  }: { body: unknown; auth?: boolean; headers?: Record<string, string> },
): Promise<T> {
  try {
    const token = auth ? Cookies.get("nir_token") : undefined;

    const { subdomain, host } = extractTenantFromHost();

    const res = await axios.post(buildApiUrl(subdomain, endpoint), body, {
      headers: {
        "X-Tenant-Domain": host,
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.log("post data error ", endpoint, error);
    throw error;
  }
}
