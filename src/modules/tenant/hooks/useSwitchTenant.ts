import { mutateClient } from "@/helpers/post-client";
import { useMutation } from "@tanstack/react-query";
import { SwitchTenantResponse } from "@/types/tenant.types";

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
