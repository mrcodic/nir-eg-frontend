import CustomError from "@/lib/customError";

// Cache resolved tenant slug for custom domains (client-side)
let _cachedTenantSlug: string | null = null;

const NIR_ROOT_DOMAIN =
  process.env.NODE_ENV === "production"
    ? (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "nir-edu.com")
    : "localhost";

export function extractTenantFromHost() {
  if (typeof window === "undefined") return { subdomain: "", host: "" };
  const host = window.location.host;
  const cleanHost = host.replace(/:\d+$/, "");

  // Standard nir-edu.com subdomain — extract directly
  if (cleanHost.endsWith(NIR_ROOT_DOMAIN)) {
    const [subdomain] = cleanHost.split(".");
    return {
      subdomain,
      host: cleanHost.endsWith("localhost") ? host : cleanHost,
    };
  }

  // Custom domain — use server-injected slug
  const slug = (window as any).__TENANT_SLUG__ ?? "";
  return { subdomain: slug, host: cleanHost };
}

export function setTenantSlug(slug: string) {
  _cachedTenantSlug = slug;
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
