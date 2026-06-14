export const NIR_PROD_DOMAIN =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "nir-edu.com";

export const NIR_DEV_DOMAIN = (
  process.env.NEXT_PUBLIC_DEV_DOMAIN ?? "localhost"
).replace(/:\d+$/, "");

export const NIR_ROOT_DOMAIN =
  process.env.NODE_ENV === "production" ? NIR_PROD_DOMAIN : NIR_DEV_DOMAIN;

export const NIR_FULL_DOMAIN =
  process.env.NODE_ENV === "production"
    ? (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "nir-edu.com")
    : (process.env.NEXT_PUBLIC_DEV_DOMAIN ?? "localhost:3000");

export const RESOLVE_TENANT_API =
  "https://admin.nir-edu.com/api/v1/central/resolve-tenant";

export const RESOLVE_TENANT_CODE =
  "https://admin.nir-edu.com/api/v1/central/invites/";

export function normalizeHost(value: string): string {
  return value.trim().replace(/:\d+$/, "").toLowerCase();
}
export function isDesktopElectronHost(cleanHost: string): boolean {
  return (
    cleanHost === "127.0.0.1" ||
    cleanHost === "localhost" ||
    cleanHost.startsWith("127.0.0.1:") ||
    cleanHost.startsWith("localhost:")
  );
}

export function hasTenantSubdomain(cleanHost: string): boolean {
  return (
    cleanHost.endsWith(`.${NIR_PROD_DOMAIN}`) ||
    cleanHost.endsWith(`.${NIR_DEV_DOMAIN}`)
  );
}

export function extractStandardTenantSlug(cleanHost: string): string | null {
  const domains = [NIR_PROD_DOMAIN, NIR_DEV_DOMAIN];

  for (const domain of domains) {
    if (cleanHost.endsWith(`.${domain}`)) {
      const slug = cleanHost.slice(0, -`.${domain}`.length).trim();
      return slug || null;
    }
  }

  return null;
}

export function isDesktopApp(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost" ||
    navigator.userAgent.toLowerCase().includes("electron")
  );
}

export function isRootHost(cleanHost: string): boolean {
  return (
    normalizeHost(cleanHost) === NIR_ROOT_DOMAIN ||
    isDesktopElectronHost(cleanHost)
  );
}

export function buildCanonicalTenantHost(slug: string): string {
  return `${slug}.${NIR_FULL_DOMAIN}`;
}

export function normalizeTenantInput(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    return new URL(withProtocol).host.toLowerCase();
  } catch {
    return trimmed
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "")
      .toLowerCase();
  }
}
