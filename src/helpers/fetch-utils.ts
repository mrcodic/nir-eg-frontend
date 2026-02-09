import CustomError from "@/lib/customError";

export function extractTenantFromHost() {
  const host = window.location.host;

  // remove port
  const cleanHost = host.replace(/:\d+$/, "");

  // school1.nir-edu.com → school1
  const [subdomain] = cleanHost.split(".");

  return { subdomain, host };
}

export function buildTenantApiBase(tenant: string) {
  const tenantUrl = process.env.NEXT_PUBLIC_TENANT_URL;
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

export function safeRedirect(path: string) {
  if (typeof window === "undefined") return;

  const current = window.location.pathname;

  if (current === path) return;

  window.location.href = path;
}
