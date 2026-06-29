"use client";

import { useMemo, useState } from "react";

import {
  navigateToDesktopTenantLogin,
  persistDesktopTenant,
} from "@/helpers/fetchers/desktop-tenant-session";
import { getUserPhoneFromStorage } from "@/lib/utils";
import { DesktopTenantRecord, UserTenant } from "@/types/tenant.types";
import useTenants from "./useTenants";

function buildTenantKey(tenant: DesktopTenantRecord) {
  return `${tenant.slug}::${tenant.host}`;
}

function mapUserTenantToDesktopRecord(tenant: UserTenant): DesktopTenantRecord {
  const domainType =
    tenant.domain_type === "domain"
      ? ("domain" as const)
      : ("subdomain" as const);
  const host = tenant.domain || tenant.slug;

  return {
    slug: tenant.slug,
    host,
    domain_type: domainType,
    name: tenant.name,
    brand_name: tenant.name,
    site_name: tenant.name,
    logo: tenant.logo || "",
    primary_color: tenant.primary_color,
    last_used_at: tenant.last_accessed_at || tenant.enrolled_at,
  };
}

export function useDesktopTenantHistory() {
  const [hiddenTenantKeys, setHiddenTenantKeys] = useState<string[]>([]);
  const historyPhone = useMemo(
    () => getUserPhoneFromStorage().phone.trim(),
    [],
  );

  const { tenants, isLoading } = useTenants(historyPhone || undefined, {
    enabled: !!historyPhone,
  });

  const mappedTenants = useMemo(() => {
    return tenants.map(mapUserTenantToDesktopRecord);
  }, [tenants]);

  const recentTenants = useMemo(() => {
    const hidden = new Set(hiddenTenantKeys);

    return mappedTenants.filter(
      (tenant) => !hidden.has(buildTenantKey(tenant)),
    );
  }, [hiddenTenantKeys, mappedTenants]);

  const connectRecentTenant = (tenant: DesktopTenantRecord) => {
    persistDesktopTenant(tenant);
    navigateToDesktopTenantLogin(tenant);
  };

  const deleteRecentTenant = (tenant: DesktopTenantRecord) => {
    setHiddenTenantKeys((prev) => [
      ...new Set([...prev, buildTenantKey(tenant)]),
    ]);
  };

  console.log(tenants);

  return {
    recentTenants,
    connectRecentTenant,
    deleteRecentTenant,
    historyPhone,
    hasStoredPhone: !!historyPhone,
    hasApiHistory: recentTenants.length > 0,
    isLoadingHistory: isLoading,
  };
}
