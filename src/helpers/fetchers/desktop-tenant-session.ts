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
  isDesktopApp,
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

export function persistDesktopTenant(record: DesktopTenantRecord) {
  const cookieOptions = {
    sameSite: "lax" as const,
    path: "/",
    expires: 30,
  };

  Cookies.set(SELECTED_TENANT_SLUG_COOKIE, record.slug, cookieOptions);
  Cookies.set(SELECTED_TENANT_HOST_COOKIE, record.host, cookieOptions);
  Cookies.set(
    SELECTED_TENANT_DOMAIN_TYPE_COOKIE,
    record.domain_type,
    cookieOptions,
  );
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

export function showImmediateAppLoader(message = "جارٍ التحميل...") {
  if (typeof window === "undefined") return;

  if (document.getElementById("app-immediate-loader")) return;

  const loader = document.createElement("div");
  loader.id = "app-immediate-loader";

  loader.innerHTML = `
    <div style="
      position: fixed;
      inset: 0;
      z-index: 999999999;
      background: rgba(255,255,255,0.96);
      display: flex;
      align-items: center;
      justify-content: center;
      direction: rtl;
      font-family: inherit;
    ">
      <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:16px;">
        <div style="
          width:56px;
          height:56px;
          border-radius:9999px;
          border:4px solid #e5e7eb;
          border-top-color:#2563eb;
          animation: appLoaderSpin 0.8s linear infinite;
        "></div>

        <div>
          <div style="font-size:16px; font-weight:700; color:#1f2937;">
            ${message}
          </div>
          <div style="font-size:14px; color:#6b7280; margin-top:6px;">
            برجاء الانتظار لحظات
          </div>
        </div>
      </div>
    </div>
  `;

  const style = document.createElement("style");
  style.id = "app-immediate-loader-style";
  style.innerHTML = `
    @keyframes appLoaderSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(loader);
}

export async function waitForLoaderPaint() {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}


export async function navigateToDesktopTenantLogin(record: DesktopTenantRecord) {
  persistDesktopTenant(record);

  showImmediateAppLoader("جارٍ فتح صفحة تسجيل الدخول...");

  await waitForLoaderPaint();

  if (isDesktopApp()) {
    window.location.assign("/login?source=electron");
    return;
  }

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
  window.dispatchEvent(new Event("app:navigation-start"));
  window.location.assign(buildDesktopEntryUrl());
}
