import { UserTenant } from "@/types/tenant.types";
import { isAxiosError } from "axios";

export const mapTemplateToNumber = {
  "landing-v1": 1,
  "landing-v2": 2,
  "landing-v3": 3,
};

export const hslToHex = (hsl: string) => {
  const [h, s, l] = hsl.replace(/%/g, "").split(" ").map(Number);
  if ([h, s, l].some(Number.isNaN)) return "#000000";

  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`;
};

export const hexToHsl = (hex: string) => {
  if (!hex) return "";

  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      case b:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export function normalizeDomain(domain: string | null | undefined): string {
  if (!domain) return "";
  return domain.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

export function buildTargetOrigin(tenant: UserTenant): string {
  const isProd = process.env.NODE_ENV === "production";

  if (tenant.domain_type === "domain") {
    const domain = normalizeDomain(tenant.domain);
    return isProd ? `https://${domain}` : `http://${domain}`;
  }

  if (isProd) {
    const domain = normalizeDomain(tenant.domain);
    return `https://${domain}`;
  }

  const currentHost = window.location.host;
  const hostWithoutPort = currentHost.replace(/:\d+$/, "");
  const portMatch = currentHost.match(/:\d+$/);
  const port = portMatch ? portMatch[0] : "";
  const hostParts = hostWithoutPort.split(".");
  const baseHost =
    hostParts.length > 1 ? hostParts.slice(1).join(".") : hostWithoutPort;

  return `http://${tenant.slug}.${baseHost}${port}`;
}

export function getSwitchTenantErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message as string | undefined;

    if (status === 401) return "انتهت الجلسة. برجاء تسجيل الدخول مرة أخرى.";
    if (status === 403) return message || "غير مسموح بالتحويل إلى هذا المدرس.";
    if (status === 404) return message || "المدرس غير موجود.";
    if (status === 422) return "بيانات التحويل غير مكتملة.";
    return message || "حدث خطأ أثناء التحويل";
  }

  return "حدث خطأ أثناء التحويل";
}
