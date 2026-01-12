import { getServerData } from "@/helpers/server-fetch";
import { extractTenantFromHostServer } from "@/helpers/server-utils";
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
    console.log(error);
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
