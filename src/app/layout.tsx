import NavTopbar from "@/components/custom/NavTopbar";
import Footer from "@/components/includes/Footer";
import NavbarWrapper from "@/components/includes/NavbarWrapper";
import { Toaster } from "@/components/ui/toaster";
import "rsuite/dist/rsuite-no-reset.min.css";
import Providers from "./providers";

import UserModalsWrapper from "@/components/UserModalsWrapper";
import { hexToHsl } from "@/helpers/template.helpers";
import { Almarai } from "next/font/google";
import "./globals.css";

const almarai = Almarai({
  subsets: ["latin"],
  variable: "--font-almarai-sans",
  weight: ["300", "400", "700", "800"],
});

export const metadata = {
  title: "NIR",
  description:
    "أكتر من مجرد منهج. !انضم الآن وطور مهاراتك اللغوية مع مس مي ماجدي طاحون.",
  metadataBase: new URL("https://more-english.net"),
  icons: {
    icon: "/logo.ico",
    apple: "https://admin.more-english.net/img/hero1.png",
  },
  openGraph: {
    type: "website",
    title: "More English - أكتر من مجرد منهج",
    description:
      "اكتر من مجرد منهج! تعلم الإنجليزية بأسلوب شيق مع منصة مس مي ماجدي طاحون.",
    url: "https://more-english.net",
    siteName: "More English",
    images: [
      {
        url: "https://admin.more-english.net/img/signup.png",
        width: 1200,
        height: 630,
        alt: "More English Cover",
      },
    ],
    locale: "ar_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "More English - تعلم الإنجليزية بطريقة ممتعة",
    description:
      "انضم إلى منصة مس مي ماجدي طاحون لتطوير مهاراتك اللغوية في الإنجليزية.",
    images: ["https://admin.more-english.net/img/signup.png"],
  },
  robots: "index, follow",
};

export default function Layout({ children }) {
  const primary = process.env.NEXT_PUBLIC_TEMPLATE_COLOR;

  console.log("primary", primary);

  const hslFromHex = hexToHsl(primary);

  const cssVars =
    hslFromHex && hslFromHex.split(" ").length === 3
      ? ({
          "--primary-h": hslFromHex.split(" ")[0],
          "--primary-s": hslFromHex.split(" ")[1],
          "--primary-l": hslFromHex.split(" ")[2],
        } as React.CSSProperties)
      : undefined;

  return (
    <html lang="ar" style={cssVars}>
      <body
        className={`${almarai.className} flex flex-col antialiased`}
        suppressHydrationWarning
      >
        <NavTopbar />

        <Providers>
          <NavbarWrapper />

          <main className="flex flex-col justify-between min-h-screen grow">
            {children}
          </main>

          <Footer />
          <UserModalsWrapper />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
