import { isProd } from "@/utils/isProd";
import { headers } from "next/headers";
import { cache } from "react";

// ---------------------------------------------------------------------------
// Reads the real visitor IP from Next.js incoming request headers.
// x-forwarded-for can be a comma-chain when behind multiple proxies —
// the first entry is always the original client.
export const getClientIp = cache(async (): Promise<string | null> => {
  const h = await headers();

  const ip =
    h.get("cf-connecting-ip") ??
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    h.get("x-real-ip") ??
    null;

  const LOOPBACK = new Set(["::1", "127.0.0.1"]);
  if (!ip || LOOPBACK.has(ip)) return null;

  return ip;
});

export async function getClientIpForwardingHeaders(): Promise<
  Record<string, string>
> {
  const clientIp = await getClientIp();

  return clientIp
    ? {
        "X-Forwarded-For": clientIp,
        "X-Real-IP": clientIp,
      }
    : {};
}

const NIR_ROOT_DOMAIN = isProd
  ? (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "nir-edu.com")
  : (process.env.NEXT_PUBLIC_DEV_DOMAIN ?? "localhost").replace(/:\d+$/, "");

// Use the main admin domain — resolve-tenant is a public central endpoint
const RESOLVE_TENANT_API =
  "https://admin.nir-edu.com/api/v1/central/resolve-tenant";

export async function extractTenantFromHostServer() {
  const host = (await headers()).get("host") ?? "";
  const cleanHost = host.replace(/:\d+$/, "");

  // Standard nir-edu.com subdomain — extract slug directly, no API call needed
  if (cleanHost.endsWith(NIR_ROOT_DOMAIN)) {
    const [subdomain] = cleanHost.split(".");
    return {
      subdomain,
      host: cleanHost.endsWith(NIR_ROOT_DOMAIN) ? host : cleanHost,
    };
  }

  // Custom domain — resolve slug via central API
  try {
    const url = `${RESOLVE_TENANT_API}?host=${encodeURIComponent(cleanHost)}`;

    const clientIpHeaders = await getClientIpForwardingHeaders();

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...clientIpHeaders,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { subdomain: null, host: cleanHost };
    }

    const data = await res.json();
    return { subdomain: data?.slug ?? null, host: cleanHost };
  } catch {
    return { subdomain: null, host: cleanHost };
  }
}
