import NavTopbar from "@/components/custom/NavTopbar";
import Footer from "@/components/includes/Footer";
import NavbarWrapper from "@/components/includes/NavbarWrapper";
import { Toaster } from "@/components/ui/toaster";
import "rsuite/dist/rsuite-no-reset.min.css";
import Providers from "./providers";

import UserModalsWrapper from "@/components/UserModalsWrapper";
import { TenantProvider } from "@/context/TenantProvider";
import { hexToHsl } from "@/helpers/tenant.helpers";
import { getTenantSettingsServer } from "@/services/getTenantSettingsServer";
import { Metadata } from "next";
import { Almarai } from "next/font/google";
import "./globals.css";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantSettingsServer();

  const siteUrl =
    tenant.domain_type === "domain"
      ? `https://${tenant.site_name}`
      : `https://${tenant.slug}.nir-edu.com`;

  const title = tenant.brand_name;
  const description =
    tenant.notes ?? "منصة تعليمية متكاملة لتطوير مهاراتك بأسلوب حديث وفعّال.";

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
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
          url: `${siteUrl}/icon.svg`,
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
      images: [`${siteUrl}/icon.svg`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Layout({ children }) {
  const tenantSettings = await getTenantSettingsServer();

  if (!tenantSettings) {
    throw new Error("Tenant settings not found");
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
  };

  return (
    <html lang="ar" style={cssVars}>
      <body
        className={`${almarai.className} group/template flex flex-col antialiased`}
        suppressHydrationWarning
        data-template={tenantSettings.landing_template}
      >
        <TenantProvider value={publicTenant}>
          <>
            <NavTopbar />

            <Providers>
              <NavbarWrapper />

              <main className="flex min-h-screen grow flex-col justify-between">
                {children}
              </main>

              <Footer />
              <UserModalsWrapper />
            </Providers>
          </>
        </TenantProvider>

        <Toaster />
      </body>
    </html>
  );
}
