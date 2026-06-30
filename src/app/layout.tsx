import "./globals.css";

import Announcement from "@/components/banners/Announcement";
import NavTopbar from "@/components/custom/NavTopbar";
import NavbarWrapper from "@/components/includes/NavbarWrapper";
import UserModalsWrapper from "@/components/shared/UserModalsWrapper";
import { TENANT_ERROR_CODES } from "@/constants/error-codes";
import { TenantProvider } from "@/context/TenantProvider";
import { getServerData } from "@/helpers/fetchers/server-fetch";
import { hexToHsl } from "@/helpers/tenant.helpers";
import QueryProvider from "@/layouts/QueryProvider";
import CustomError from "@/lib/customError";
import { getTenantSettingsServer } from "@/services/tenant.service";
import { ApiResponse, IUser } from "@/types";
import { Metadata } from "next";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Almarai } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import CustomGlobalError from "./CustomGlobalError";
import NotFoundTenant from "./NotFoundTenant";
import Providers from "./providers";
import SuspendedTenant from "./SuspendedTenant";

import { Toaster as MainToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import DownloadListener from "@/components/DownloadListener";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const isProd = process.env.NODE_ENV === "production";
const devDomain = process.env.NEXT_PUBLIC_DEV_DOMAIN ?? "localhost:3000";
const DESKTOP_ROUTE_PREFIX = "/desktop";

function isDesktopBootstrapPath(pathname: string) {
  return pathname === DESKTOP_ROUTE_PREFIX || pathname.startsWith("/desktop/");
}

export async function generateMetadata(): Promise<Metadata> {
  const pathname = (await headers()).get("x-pathname") ?? "/";

  if (isDesktopBootstrapPath(pathname)) {
    return {
      title: "NIR Desktop",
      description: "اختر منصتك ثم تابع تسجيل الدخول",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const tenant = await getTenantSettingsServer();

  const siteUrl =
    tenant.domain_type === "domain"
      ? `https://${tenant.site_name}`
      : `${isProd ? "https" : "http"}://${tenant.slug}.${isProd ? process.env.NEXT_PUBLIC_ROOT_DOMAIN : devDomain}`;

  const metadataBase = new URL(siteUrl);
  const title = tenant.site_name;
  const description =
    tenant.notes?.trim() ||
    "منصة تعليمية متكاملة لتطوير مهاراتك بأسلوب حديث وفعّال.";
  const favicon = tenant.favicon || "/favicon.ico";
  const ogImage = tenant.cover || tenant.logo || "/icon.svg";

  return {
    metadataBase,
    title,
    description,
    icons: {
      icon: favicon,
      apple: favicon,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: siteUrl,
      siteName: tenant.brand_name,
      locale: "ar_AR",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: tenant.brand_name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") ?? "/";

  if (isDesktopBootstrapPath(pathname)) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${almarai.className} flex min-h-screen flex-col antialiased`}
        suppressHydrationWarning
        dir="rtl"
      >
            <QueryProvider>
          <main className="flex min-h-screen grow flex-col">{children}</main>
            </QueryProvider>

        <DownloadListener />

        <SonnerToaster
          dir="rtl"
          position="top-right"
          richColors
          closeButton
        />

        <MainToaster />
      </body>
    </html>
  );
}

  let tenantSettings: Awaited<ReturnType<typeof getTenantSettingsServer>>;

  try {
    tenantSettings = await getTenantSettingsServer();
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    if (e instanceof CustomError) {
      if (e.code === TENANT_ERROR_CODES.TENANT_SUSPENDED) {
        return <SuspendedTenant />;
      }
      if (e.code === TENANT_ERROR_CODES.TENANT_NOT_FOUND) {
        return <NotFoundTenant />;
      }
      return <CustomGlobalError error={e} />;
    }

    const error = new CustomError(
      "UNEXPECTED",
      (e as { status?: number })?.status || 500,
      "UNEXPECTED",
    );
    return <CustomGlobalError error={error} />;
  }

  const profile = await getServerData<ApiResponse<IUser | null>>({
    queryKey: [`/students/profile`],
  });

  const hslFromHex = hexToHsl(tenantSettings.primary_color);
  const cssVars =
    hslFromHex && hslFromHex.split(" ").length === 3
      ? ({
          "--primary-h": hslFromHex.split(" ")[0],
          "--primary-s": hslFromHex.split(" ")[1],
          "--primary-l": hslFromHex.split(" ")[2],
        } as React.CSSProperties)
      : undefined;

  const publicTenant = {
    name: tenantSettings.name,
    brand_name: tenantSettings.brand_name,
    primary_color: tenantSettings.primary_color,
    landing_template: tenantSettings.landing_template,
    site_name: tenantSettings.site_name,
    logo: tenantSettings.logo,
    features: tenantSettings?.features,
  };

  return (
    <html lang="ar" style={cssVars} dir="rtl">
      <body
        className={`${almarai.className} group/template flex flex-col antialiased`}
        suppressHydrationWarning
        data-template={tenantSettings.landing_template}
        dir="rtl"
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__TENANT_SLUG__ = ${JSON.stringify(tenantSettings.slug ?? "")};`,
          }}
        />

        <TenantProvider value={publicTenant}>
          <Providers profile={profile?.body ?? null}>
            <NavTopbar primary={tenantSettings.primary_color} />

            <NavbarWrapper profile={profile?.body ?? null} />

            <main className="flex min-h-screen grow flex-col justify-between [&>section]:grow">
              {children}
            </main>

            <UserModalsWrapper />
            <Announcement />
          </Providers>
        </TenantProvider>

        <DownloadListener />

        <SonnerToaster
          dir="rtl"
          position="top-right"
          richColors
          closeButton
        />

        <MainToaster />

        <Script
          src="https://player.vdocipher.com/v2/api.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://assets.mediadelivery.net/playerjs/player-0.1.0.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
