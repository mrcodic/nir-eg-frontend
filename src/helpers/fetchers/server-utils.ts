import {
  SELECTED_TENANT_DOMAIN_TYPE_COOKIE,
  SELECTED_TENANT_HOST_COOKIE,
  SELECTED_TENANT_SLUG_COOKIE,
} from "@/constants/tenant-session";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import {
  extractStandardTenantSlug,
  isRootHost,
  normalizeHost,
  RESOLVE_TENANT_API,
} from "./tenant-resolution";

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

export async function extractTenantFromHostServer() {
  const host = (await headers()).get("host") ?? "";
  const cleanHost = host.replace(/:\d+$/, "");

  const subdomain = extractStandardTenantSlug(cleanHost);
  if (subdomain) {
    return {
      subdomain,
      host,
    };
  }

  if (!isRootHost(cleanHost)) {
    try {
      const url = `${RESOLVE_TENANT_API}?host=${encodeURIComponent(cleanHost)}`;
      const clientIp = await getClientIp();

      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          ...(clientIp
            ? {
                "X-Forwarded-For": clientIp,
                "X-Real-IP": clientIp,
              }
            : {}),
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

  const cookieStore = await cookies();
  const selectedSlug = cookieStore.get(SELECTED_TENANT_SLUG_COOKIE)?.value;
  const selectedHost = cookieStore.get(SELECTED_TENANT_HOST_COOKIE)?.value;
  const selectedDomainType = cookieStore.get(
    SELECTED_TENANT_DOMAIN_TYPE_COOKIE,
  )?.value;

  if (selectedSlug) {
    return {
      subdomain: selectedSlug,
      host:
        selectedDomainType === "domain"
          ? normalizeHost(selectedHost || cleanHost)
          : selectedHost || host,
    };
  }

  return { subdomain: null, host: cleanHost };
}
