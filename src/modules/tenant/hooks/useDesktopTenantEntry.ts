"use client";

import { useToast } from "@/hooks/use-toast";
import {
  getRecentDesktopTenants,
  navigateToDesktopTenantLogin,
  persistDesktopTenant,
  removeRecentDesktopTenant,
  resolveDesktopTenant,
  TenantEntryMode,
} from "@/helpers/fetchers/desktop-tenant-session";
import { getUserPhoneFromStorage } from "@/lib/utils";
import { DesktopTenantRecord } from "@/types/tenant.types";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export function useDesktopTenantEntry() {
  const { toast } = useToast();
  const [mode, setMode] = useState<TenantEntryMode>("code");
  const [platformCode, setPlatformCode] = useState("");
  const [platformUrl, setPlatformUrl] = useState("");
  const [recentTenants, setRecentTenants] = useState<DesktopTenantRecord[]>(
    () => getRecentDesktopTenants(),
  );

  const lastPhone = useMemo(() => getUserPhoneFromStorage().phone, []);

  const mutation = useMutation({
    mutationFn: async () => {
      const value = mode === "code" ? platformCode : platformUrl;
      return resolveDesktopTenant(value, mode);
    },
    onSuccess: (tenant) => {
      persistDesktopTenant(tenant);
      setRecentTenants(getRecentDesktopTenants());
      navigateToDesktopTenantLogin(tenant);
    },
    onError: (error: Error) => {
      toast({
        description: error.message || "تعذر الاتصال بهذه المنصة",
        icon: "error",
      });
    },
  });

  const connectRecentTenant = (tenant: DesktopTenantRecord) => {
    persistDesktopTenant(tenant);
    setRecentTenants(getRecentDesktopTenants());
    navigateToDesktopTenantLogin(tenant);
  };

  const deleteRecentTenant = (tenant: DesktopTenantRecord) => {
    removeRecentDesktopTenant(tenant);
    setRecentTenants(getRecentDesktopTenants());
  };

  return {
    mode,
    setMode,
    platformCode,
    setPlatformCode,
    platformUrl,
    setPlatformUrl,
    recentTenants,
    connectRecentTenant,
    deleteRecentTenant,
    lastPhone,
    submit: () => mutation.mutate(),
    isPending: mutation.isPending,
  };
}
