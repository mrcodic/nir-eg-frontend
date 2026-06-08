"use client";

import { useToast } from "@/hooks/use-toast";
import {
  navigateToDesktopTenantLogin,
  persistDesktopTenant,
  resolveDesktopTenant,
  TenantEntryMode,
} from "@/helpers/fetchers/desktop-tenant-session";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useDesktopTenantEntry() {
  const { toast } = useToast();
  const [mode, setMode] = useState<TenantEntryMode>("code");
  const [platformCode, setPlatformCode] = useState("");
  const [platformUrl, setPlatformUrl] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const value = mode === "code" ? platformCode : platformUrl;
      return resolveDesktopTenant(value, mode);
    },
    onSuccess: (tenant) => {
      persistDesktopTenant(tenant);
      navigateToDesktopTenantLogin(tenant);
    },
    onError: (error: Error) => {
      toast({
        description: error.message || "تعذر الاتصال بهذه المنصة",
        icon: "error",
      });
    },
  });

  return {
    mode,
    setMode,
    platformCode,
    setPlatformCode,
    platformUrl,
    setPlatformUrl,
    submit: () => mutation.mutate(),
    isPending: mutation.isPending,
  };
}
