import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { UserTenant } from "@/types/tenant.types";
import { useQuery } from "@tanstack/react-query";

type UseTenantsOptions = {
  enabled?: boolean;
};

async function fetchTenantsByPhone(phone: string) {
  const response = await fetch(
    `https://admin.hq.nir-edu.com/api/central/student/enrollments?phone=${encodeURIComponent(phone.trim())}`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("تعذر تحميل سجل المنصات لهذا الرقم");
  }

  return (await response.json()) as { data: UserTenant[] };
}

export default function useTenants(
  phone?: string,
  options?: UseTenantsOptions,
) {
  const { data, isLoading, error } = useQuery<{ data: UserTenant[] }>({
    queryKey: ["central/student/enrollments", phone ?? ""],
    queryFn: async () => {
      if (phone?.trim()) {
        return fetchTenantsByPhone(phone);
      }

      return getClientPrivateData<{ data: UserTenant[] }>({
        queryKey: ["central/student/enrollments"],
      });
    },
    enabled: options?.enabled ?? true,
  });

  return { tenants: data?.data || [], isLoading, error };
}
