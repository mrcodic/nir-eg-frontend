import { extractTenantFromHost } from "@/helpers/fetch-utils";
import { LoginResponse } from "@/types/auth.types";

type OpenDesktopAuthDeeplinkOptions = {
  onFailure?: () => void;
};

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

export function openDesktopAuthDeeplink(
  response: LoginResponse,
  options: OpenDesktopAuthDeeplinkOptions = {},
): boolean {
  const deeplink = buildAuthDeeplink(response);
  if (!deeplink || typeof window === "undefined") return false;

  const shouldOpen = window.confirm("Open the desktop application now?");
  if (!shouldOpen) return false;

  let didLeavePage = false;

  const markLeftPage = () => {
    didLeavePage = true;
    console.log("markLeftPage");
    cleanup();
  };

  const cleanup = () => {
    window.removeEventListener("pagehide", markLeftPage);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      markLeftPage();
    }
  };

  window.addEventListener("pagehide", markLeftPage, { once: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);

  window.location.assign(deeplink);

  window.setTimeout(() => {
    cleanup();
    if (!didLeavePage) {
      options.onFailure?.();
    }
  }, 1500);

  return true;
}
