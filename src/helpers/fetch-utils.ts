import CustomError from "@/lib/customError";

export interface FetchOptions {
  queryKey: readonly unknown[];
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  auth?: boolean;
}

export function extractTenantFromHost() {
  const host = window.location.host;

  // remove port
  const cleanHost = host.replace(/:\d+$/, "");

  // school1.nir-edu.com → school1
  const [subdomain] = cleanHost.split(".");

  return { subdomain, host };
}

export function buildTenantApiBase(tenant: string) {
  return `https://${tenant}.dev.nir-edu.com/api/v1`;
}

export function buildApiUrl(tenant: string, endpoint: string) {
  return `${buildTenantApiBase(tenant)}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;
}

export async function parseError(res: Response) {
  try {
    const data = await res.json();

    console.log(data);
    throw new CustomError(data?.message ?? "Request failed", res.status);
  } catch {
    throw new CustomError("Request failed", res.status);
  }
}
