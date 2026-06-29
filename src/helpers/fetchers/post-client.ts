import axios, { isAxiosError } from "axios";
import Cookies from "js-cookie";
import { handleClientFetchError } from "./client-error-handler";
import { buildApiUrl, extractTenantFromHost } from "./fetch-utils";

export async function mutateClient<T = any>(
  endpoint: string,
  {
    body,
    auth = false,
    headers,
  }: { body?: unknown; auth?: boolean; headers?: Record<string, string> } = {},
): Promise<T> {
  try {
    const token = Cookies.get("nir_token");

    const { subdomain, host } = extractTenantFromHost();

    const res = await axios.post(buildApiUrl(subdomain, endpoint), body, {
      headers: {
        "X-Tenant-Domain": host,
        ...(auth || token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.log("post data error ", endpoint, error);

    if (isAxiosError(error) && error.status === 401) {
      handleClientFetchError(error, endpoint);
    } else {
      throw error;
    }
  }
}
