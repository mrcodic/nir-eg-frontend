import { getServerData } from "@/helpers/server-fetch";
import { extractTenantFromHostServer } from "@/helpers/server-utils";
import CustomError from "@/lib/customError";
import { TenantLandingResponse, TenantSettings } from "@/types/tenant.types";
import { cache } from "react";

export const getTenantSettingsServer = cache(async () => {
  try {
    const tenant = await extractTenantFromHostServer();

    const response = await getServerData({
      queryKey: [`/central/tenants/${tenant.subdomain}`],
      isAuth: false,
    });

    return response?.body as TenantSettings;
  } catch (error) {
    if (error instanceof CustomError) {
      if (error.status === 404) {
        const err = new Error("TENANT_NOT_FOUND");
        err.name = "TenantNotFoundError";
        throw err;
      }
    }
    throw error;
  }
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
