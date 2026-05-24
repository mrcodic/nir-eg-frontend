import { extractTenantFromHost } from "@/helpers/fetch-utils";
import { LoginResponse } from "@/types/auth.types";

export function buildAuthDeeplink(response: LoginResponse): string | null {
  const deeplinkToken = response?.deeplink_token;
  if (!deeplinkToken) return null;

  const { subdomain } = extractTenantFromHost();
  const tenantSlug = subdomain || response?.enrollments?.[0]?.slug;
  if (!tenantSlug) return null;

  const token = encodeURIComponent(deeplinkToken);
  const tenant = encodeURIComponent(tenantSlug);

  return `nir://auth?token=${token}&tenant=${tenant}`;
}

export function openDesktopAuthDeeplink(response: LoginResponse): boolean {
  const deeplink = buildAuthDeeplink(response);
  if (!deeplink || typeof window === "undefined") return false;

  window.location.assign(deeplink);
  return true;
}
