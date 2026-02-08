import { getServerData } from "@/helpers/server-fetch";
import { extractTenantFromHostServer } from "@/helpers/server-utils";
import CustomError from "@/lib/customError";
import { TenantLandingResponse, TenantSettings } from "@/types/tenant.types";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export const getTenantSettingsServer = cache(
  unstable_cache(
    async () => {
      try {
        const tenant = await extractTenantFromHostServer();

        const response = await getServerData({
          queryKey: [`/central/tenants/${tenant.subdomain}`],
          isAuth: false,
        });

        return response?.body as TenantSettings;
      } catch (error) {
        console.log(error);
        if (error instanceof CustomError) {
          if (error.status === 404) {
            const error = new Error("TENANT_NOT_FOUND");
            error.name = "TenantNotFoundError";
            throw error;
          }
        }
        throw error;
      }
    },
    ["tenant-settings"],
    {
      revalidate: 3600, // Cache for 1 hour
    },
  ),
);

export const getTenantContentServer = cache(
  unstable_cache(
    async () => {
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
    },
    ["tenant-content"],
    {
      revalidate: 3600, // Cache for 1 hour
    },
  ),
);
