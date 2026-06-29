import CustomError from "@/lib/customError";
import { extractStandardTenantSlug } from "./tenant-resolution";

export function extractTenantFromHost() {
  if (typeof window === "undefined") return { subdomain: "", host: "" };

  const host = window.location.host;
  const cleanHost = host.replace(/:\d+$/, "");

  const subdomain = extractStandardTenantSlug(cleanHost);
  if (subdomain) {
    return {
      subdomain,
      host,
    };
  }

  const slug = (window as any).__TENANT_SLUG__ ?? "";
  return { subdomain: slug, host: cleanHost };
}

export function buildTenantApiBase(tenant: string) {
  const tenantUrl = process.env.NEXT_PUBLIC_TENANT_URL;
  if (!tenant || tenant === "null") {
    console.error("[buildTenantApiBase] invalid tenant:", tenant);
    return tenantUrl.replace("tenant", "");
  }
  return tenantUrl.replace("tenant", tenant);
}

export function buildApiUrl(tenant: string, endpoint: string) {
  return `${buildTenantApiBase(tenant)}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;
}

export async function parseError(res: Response): Promise<never> {
  let message = "Request failed";
  let payload: unknown = null;

  try {
    payload = await res.json();

    if (
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof (payload as any).message === "string"
    ) {
      message = (payload as any).message;
    }
  } catch {
    // response has no JSON body (204, HTML error, etc.)
  }

  throw new CustomError(message, res.status);
}
