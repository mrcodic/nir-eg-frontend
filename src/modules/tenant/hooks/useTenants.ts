import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { UserTenant } from "@/types/tenant.types";
import { useQuery } from "@tanstack/react-query";

export default function useTenants() {
  const { data, isLoading, error } = useQuery<{ data: UserTenant[] }>({
    queryKey: ["central/student/enrollments"],
    queryFn: getClientPrivateData,
  });

  return { tenants: data?.data || [], isLoading, error };
}
