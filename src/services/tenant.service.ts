import { buildApiUrl } from "@/helpers/fetch-utils";
import { getServerData } from "@/helpers/server-fetch";
import { extractTenantFromHostServer } from "@/helpers/server-utils";
import CustomError from "@/lib/customError";
import { TenantLandingResponse, TenantSettings } from "@/types/tenant.types";
import { cache } from "react";

export const getTenantSettingsServer = cache(async () => {
  const tenant = await extractTenantFromHostServer();

  if (!tenant.subdomain) {
    throw new CustomError("TENANT_NOT_FOUND", 404, "TENANT_NOT_FOUND");
  }
  extractTenantFromHostServer;
  const url = buildApiUrl(
    tenant.subdomain,
    `/central/tenants/${tenant.subdomain}`,
  );

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-Tenant-Domain": tenant.host,
    },
    cache: "default",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message = data?.message ?? "Request failed";

    if (res.status === 403) {
      throw new CustomError(message, 403, "TENANT_SUSPENDED");
    }

    if (res.status === 404) {
      throw new CustomError(message, 404, "TENANT_NOT_FOUND");
    }

    throw new CustomError(message, res.status, "UNEXPECTED");
  }

  const response = await res.json();
  return response?.body as TenantSettings;
});

export const getTenantContentServer = cache(async () => {
  try {
    // const tenant = await extractTenantFromHostServer();

    const response = await getServerData({
      queryKey: [`/landing`],
      isAuth: false,
    });

    return response as TenantLandingResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
});
