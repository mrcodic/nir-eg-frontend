import { headers } from "next/headers";

export async function extractTenantFromHostServer() {
  const host = (await headers()).get("host");

  // remove port
  const cleanHost = host.replace(/:\d+$/, "");

  // school1.nir-edu.com → school1
  const [subdomain] = cleanHost.split(".");

  return { subdomain, host };
}
