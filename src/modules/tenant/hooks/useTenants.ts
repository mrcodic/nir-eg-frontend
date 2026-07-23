import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { UserTenant } from "@/types/tenant.types";
import { useQuery } from "@tanstack/react-query";

export default function useTenants() {
  const { data, isLoading, error } = useQuery<UserTenant[]>({
    queryKey: ["central/student/enrollments"],
    queryFn: async () => {
      const res = await getClientPrivateData({
        queryKey: ["central/student/enrollments"],
      });

      const tenants = res.data.filter(
        (tenant) => tenant.tenant_status === "active",
      );

      return tenants || [];
    },
  });

  return { tenants: data || [], isLoading, error };
}
