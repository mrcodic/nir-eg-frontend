import { mutateClient } from "@/helpers/fetchers/post-client";
import { SwitchTenantResponse } from "@/types/tenant.types";
import { useMutation } from "@tanstack/react-query";

export default function useSwitchTenant() {
  return useMutation({
    mutationFn: async (tenantId: string) => {
      const data = await mutateClient<SwitchTenantResponse>(
        "/central/switch-tenant",
        {
          body: { tenant_id: tenantId },
        },
      );

      return data;
    },
  });
}
