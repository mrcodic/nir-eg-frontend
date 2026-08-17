import { TENANT_ERROR_CODES } from "@/constants/error-codes";
import { buildApiUrl } from "@/helpers/fetchers/fetch-utils";
import { getServerData } from "@/helpers/fetchers/server-fetch";
import {
  extractTenantFromHostServer,
  getClientIpForwardingHeaders,
} from "@/helpers/fetchers/server-utils";
import CustomError from "@/lib/customError";
import {
  LandingSummaryResponse,
  TenantLandingResponse,
  TenantSettings,
} from "@/types/tenant.types";
import { cache } from "react";

export const getTenantSettingsServer = cache(async () => {
  const [tenant, clientIpHeaders] = await Promise.all([
    extractTenantFromHostServer(),
    getClientIpForwardingHeaders(),
  ]);

  if (!tenant.subdomain) {
    throw new CustomError(
      TENANT_ERROR_CODES.TENANT_NOT_FOUND,
      404,
      TENANT_ERROR_CODES.TENANT_NOT_FOUND,
    );
  }

  const url = buildApiUrl(
    tenant.subdomain,
    `/central/tenants/${tenant.subdomain}`,
  );

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-Tenant-Domain": tenant.host,
      ...clientIpHeaders,
    },
    cache: "default",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message = data?.message ?? "Request failed";
    const apiCode = data?.code as string | undefined;

    if (apiCode === TENANT_ERROR_CODES.TENANT_SUSPENDED || res.status === 403) {
      throw new CustomError(message, 403, TENANT_ERROR_CODES.TENANT_SUSPENDED);
    }

    if (apiCode === TENANT_ERROR_CODES.TENANT_NOT_FOUND || res.status === 404) {
      throw new CustomError(message, 404, TENANT_ERROR_CODES.TENANT_NOT_FOUND);
    }

    throw new CustomError(message, res.status, "UNEXPECTED");
  }

  const response = await res.json();
  return response?.body as TenantSettings;
});

export const getTenantContentServer = cache(async () => {
  const response = await getServerData<TenantLandingResponse>({
    queryKey: [`/landing`],
    isAuth: false,
  });

  return response;
});
export const getTenantSummaryServer = cache(async () => {
  const response = await getServerData<LandingSummaryResponse>({
    queryKey: [`/summer-landing`],
    isAuth: false,
  });

  return response;
});
