import NavTopbar from "@/components/custom/NavTopbar";
import Footer from "@/components/includes/Footer";
import NavbarWrapper from "@/components/includes/NavbarWrapper";
import { Toaster } from "@/components/ui/toaster";
import Providers from "./providers";

import Announcement from "@/components/banners/Announcement";
import UserModalsWrapper from "@/components/UserModalsWrapper";
import { TenantProvider } from "@/context/TenantProvider";
import { hexToHsl } from "@/helpers/tenant.helpers";
import { getTenantSettingsServer } from "@/services/tenantServices";
import { Metadata } from "next";
import { Almarai } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Script from "next/script";
import CustomGlobalError from "./CustomGlobalError";
import CustomError from "@/lib/customError";
import SuspendedTenant from "./SuspendedTenant";
import NotFoundTenant from "./NotFoundTenant";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const isProd = process.env.NODE_ENV === "production";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantSettingsServer();

  const siteUrl =
    tenant.domain_type === "domain"
      ? `https://${tenant.site_name}`
      : `https://${tenant.slug}.${isProd ? "nir-edu.com" : "localhost:3000"}`;

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

export default async function Layout({ children }) {
  let tenantSettings;

  try {
    tenantSettings = await getTenantSettingsServer();
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    if (e instanceof CustomError) {
      if (e.code === "TENANT_SUSPENDED") return <SuspendedTenant />;
      else if (e.code === "TENANT_NOT_FOUND") return <NotFoundTenant />;
      else {
        return <CustomGlobalError error={e} />;
      }
    }

    const error = new CustomError(
      "UNEXPECTED",
      (e as any)?.status || 500,
      "UNEXPECTED",
    );
    return <CustomGlobalError error={error} />;
  }

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
    <html lang="ar" style={cssVars}>
      <body
        className={`${almarai.className} group/template flex flex-col antialiased`}
        suppressHydrationWarning
        data-template={tenantSettings.landing_template}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__TENANT_SLUG__ = ${JSON.stringify(tenantSettings.slug ?? "")};`,
          }}
        />
        <TenantProvider value={publicTenant}>
          <>
            <NavTopbar primary={tenantSettings.primary_color} />

            <Providers>
              <NavbarWrapper />

              <main className="flex min-h-screen grow flex-col justify-between [&>section]:grow">
                {children}
              </main>

              <Suspense fallback={<footer className="bg-background h-80" />}>
                <Footer />
              </Suspense>
              <UserModalsWrapper />
              <Announcement />
            </Providers>
          </>
        </TenantProvider>

        <Toaster />

        <Script
          src="https://player.vdocipher.com/v2/api.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
