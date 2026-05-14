import { headers } from "next/headers";

const NIR_ROOT_DOMAIN =
  process.env.NODE_ENV === "production"
    ? (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "nir-edu.com")
    : "localhost";
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
      host: cleanHost.endsWith("localhost") ? host : cleanHost,
    };
  }

  // Custom domain — resolve slug via central API
  try {
    const url = `${RESOLVE_TENANT_API}?host=${encodeURIComponent(cleanHost)}`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
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
