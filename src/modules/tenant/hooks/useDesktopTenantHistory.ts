"use client";

import { useMemo, useState } from "react";

import {
  fetchDesktopTenantHistoryByPhone,
  navigateToDesktopTenantLogin,
  persistDesktopTenant,
} from "@/helpers/fetchers/desktop-tenant-session";
import { getUserPhoneFromStorage } from "@/lib/utils";
import { DesktopTenantRecord } from "@/types/tenant.types";
import { useQuery } from "@tanstack/react-query";

function buildTenantKey(tenant: DesktopTenantRecord) {
  return `${tenant.slug}::${tenant.host}`;
}

export function useDesktopTenantHistory() {
  const [hiddenTenantKeys, setHiddenTenantKeys] = useState<string[]>([]);
  const historyPhone = useMemo(
    () => getUserPhoneFromStorage().phone.trim(),
    [],
  );

  const historyQuery = useQuery({
    queryKey: ["desktop-tenant-history", historyPhone],
    queryFn: async () => fetchDesktopTenantHistoryByPhone(historyPhone),
    enabled: !!historyPhone,
    staleTime: 1000 * 60 * 5,
  });

  const recentTenants = useMemo(() => {
    const hidden = new Set(hiddenTenantKeys);
    const tenants = historyQuery.data ?? [];

    return tenants.filter((tenant) => !hidden.has(buildTenantKey(tenant)));
  }, [hiddenTenantKeys, historyQuery.data]);

  const connectRecentTenant = (tenant: DesktopTenantRecord) => {
    persistDesktopTenant(tenant);
    navigateToDesktopTenantLogin(tenant);
  };

  const deleteRecentTenant = (tenant: DesktopTenantRecord) => {
    setHiddenTenantKeys((prev) => [
      ...new Set([...prev, buildTenantKey(tenant)]),
    ]);
  };

  return {
    recentTenants,
    connectRecentTenant,
    deleteRecentTenant,
    historyPhone,
    hasStoredPhone: !!historyPhone,
    isLoadingHistory: historyQuery.isFetching,
  };
}
