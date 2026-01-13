"use client";

import { mapTemplateToNumber } from "@/helpers/tenant.helpers";
import { createContext, useContext } from "react";

export interface TenantPublic {
  name: string;
  brand_name: string;
  primary_color: string;
  landing_template: string;
  site_name: string;
  logo: string;
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
  return (
    <TenantContext.Provider
      value={{
        ...value,
        templateNumber: mapTemplateToNumber[value.landing_template],
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}
