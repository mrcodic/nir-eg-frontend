"use client";

import { mapTemplateToNumber } from "@/helpers/tenant.helpers";
import { Templates, TenantFeatures } from "@/types/tenant.types";
import { createContext, useContext, useMemo } from "react";

export interface TenantPublic {
  name: string;
  brand_name: string;
  primary_color: string;
  landing_template: Templates;
  site_name: string;
  logo: string;
  features: TenantFeatures;
}

const TenantContext = createContext<
  (TenantPublic & { templateNumber: number }) | null
>(null);

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error("useTenant must be used within TenantProvider");
  }
  return ctx;
}

export function TenantProvider({
  value,
  children,
}: {
  value: TenantPublic;
  children: React.ReactNode;
}) {
  const providerValue = useMemo(
    () => ({
      ...value,
      templateNumber: mapTemplateToNumber[value.landing_template],
    }),
    [value],
  );

  return (
    <TenantContext.Provider value={providerValue}>
      {children}
    </TenantContext.Provider>
  );
}
