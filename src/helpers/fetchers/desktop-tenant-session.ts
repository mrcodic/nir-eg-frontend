"use client";

import {
  SELECTED_TENANT_DOMAIN_TYPE_COOKIE,
  SELECTED_TENANT_HOST_COOKIE,
  SELECTED_TENANT_SLUG_COOKIE,
} from "@/constants/tenant-session";
import {
  buildDesktopEntryUrl,
  buildTargetOrigin,
  normalizeDomain,
} from "@/helpers/tenant.helpers";
import {
  DesktopTenantRecord,
  TenantInviteResolutionResponse,
  TenantSettings,
} from "@/types/tenant.types";
import { deleteCookie } from "@/utils/api";
import Cookies from "js-cookie";
import { buildApiUrl } from "./fetch-utils";
import {
  buildCanonicalTenantHost,
  extractStandardTenantSlug,
  normalizeHost,
  normalizeTenantInput,
  RESOLVE_TENANT_API,
  RESOLVE_TENANT_CODE,
} from "./tenant-resolution";

export type TenantEntryMode = "url" | "code";

function buildRecordFromTenantSettings(
  tenant: TenantSettings,
  host: string,
  domainType: "subdomain" | "domain",
): DesktopTenantRecord {
  return {
    slug: tenant.slug,
    host,
    domain_type: domainType,
    name: tenant.name,
    brand_name: tenant.brand_name,
    site_name: tenant.site_name,
    logo: tenant.logo,
    primary_color: tenant.primary_color,
    last_used_at: new Date().toISOString(),
  };
}

async function fetchTenantSettingsBySlug(
  slug: string,
  host: string,
  domainType: "subdomain" | "domain",
) {
  const response = await fetch(buildApiUrl(slug, `/central/tenants/${slug}`), {
    headers: {
      Accept: "application/json",
      "X-Tenant-Domain": domainType === "domain" ? normalizeDomain(host) : host,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("تعذر تحميل بيانات المنصة");
  }

  const data = await response.json();
  return data?.body as TenantSettings;
}

async function resolveCustomDomainSlug(host: string) {
  const response = await fetch(
    `${RESOLVE_TENANT_API}?host=${encodeURIComponent(normalizeDomain(host))}`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("تعذر العثور على المنصة من هذا الرابط");
  }

  const data = await response.json();
  if (!data?.slug) {
    throw new Error("تعذر العثور على المنصة من هذا الرابط");
  }

  return data.slug as string;
}

async function resolveTenantFromCode(code: string) {
  const cleanCode = code.trim();
  if (!cleanCode) {
    throw new Error("أدخل كود منصة صحيح");
  }

  const response = await fetch(RESOLVE_TENANT_CODE + cleanCode, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("تعذر العثور على منصة بهذا الكود");
  }

  const data = (await response.json()) as TenantInviteResolutionResponse;
  const tenant = data?.tenant;

  if (data.status !== "valid" || !tenant?.slug) {
    throw new Error("تعذر العثور على منصة بهذا الكود");
  }

  return {
    slug: tenant.slug,
    host:
      tenant.domain_type === "domain" && tenant.domain
        ? normalizeDomain(tenant.domain)
        : buildCanonicalTenantHost(tenant.slug),
    domainType: tenant.domain_type === "domain" ? "domain" : "subdomain",
  } as const;
}

function parseTenantUrl(value: string) {
  const host = normalizeTenantInput(value);
  if (!host) {
    throw new Error("أدخل رابط منصة صحيح");
  }

  const cleanHost = normalizeHost(host);
  const slug = extractStandardTenantSlug(cleanHost);

  if (slug) {
    return {
      slug,
      host,
      domainType: "subdomain" as const,
    };
  }

  return {
    slug: null,
    host: cleanHost,
    domainType: "domain" as const,
  };
}

export async function resolveDesktopTenant(
  value: string,
  mode: TenantEntryMode,
): Promise<DesktopTenantRecord> {
  const parsed =
    mode === "code"
      ? await resolveTenantFromCode(value)
      : parseTenantUrl(value);
  const slug = parsed.slug ?? (await resolveCustomDomainSlug(parsed.host));

  const tenant = await fetchTenantSettingsBySlug(
    slug,
    parsed.host,
    parsed.domainType,
  );

  return buildRecordFromTenantSettings(tenant, parsed.host, parsed.domainType);
}

export async function fetchDesktopTenantHistoryByPhone(
  phone: string,
): Promise<DesktopTenantRecord[]> {
  void phone;

  // TODO: replace this placeholder with the central desktop history endpoint
  // once the backend contract is available.
  return [];
}

export function persistDesktopTenant(record: DesktopTenantRecord) {
  Cookies.set(SELECTED_TENANT_SLUG_COOKIE, record.slug, {
    sameSite: "lax",
    path: "/",
  });
  Cookies.set(SELECTED_TENANT_HOST_COOKIE, record.host, {
    sameSite: "lax",
    path: "/",
  });
  Cookies.set(SELECTED_TENANT_DOMAIN_TYPE_COOKIE, record.domain_type, {
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSelectedDesktopTenant() {
  Cookies.remove(SELECTED_TENANT_SLUG_COOKIE, { path: "/" });
  Cookies.remove(SELECTED_TENANT_HOST_COOKIE, { path: "/" });
  Cookies.remove(SELECTED_TENANT_DOMAIN_TYPE_COOKIE, { path: "/" });

  await deleteCookie([
    SELECTED_TENANT_SLUG_COOKIE,
    SELECTED_TENANT_HOST_COOKIE,
    SELECTED_TENANT_DOMAIN_TYPE_COOKIE,
  ]);
}

export function navigateToDesktopTenantLogin(record: DesktopTenantRecord) {
  const targetOrigin = buildTargetOrigin({
    domain: record.host,
    domain_type: record.domain_type,
    enrolled_at: "",
    last_accessed_at: record.last_used_at,
    logo: record.logo,
    name: record.name,
    primary_color: record.primary_color,
    slug: record.slug,
    source: "desktop-entry",
    status: "active",
    tenant_id: record.slug,
    tenant_status: 1,
    tenant_user_id: 0,
  });

  window.location.assign(`${targetOrigin}/login`);
}

export function navigateToDesktopEntry() {
  window.location.assign(buildDesktopEntryUrl());
}
