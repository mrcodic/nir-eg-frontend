import NavTopbar from "@/components/custom/NavTopbar";
import Footer from "@/components/includes/Footer";
import NavbarWrapper from "@/components/includes/NavbarWrapper";
import { Toaster } from "@/components/ui/toaster";
import WhatsappFloating from "@/components/WhatsappFloating";
import "rsuite/dist/rsuite-no-reset.min.css";
import Providers from "./providers";

import UserModalsWrapper from "@/components/UserModalsWrapper";
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
  metadataBase: new URL("https://more-english.net"), // Base URL for relative links
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
// const { token } = useContext(AuthContext);

export default function Layout({ children }) {
  return (
    <html lang="ar" className="">
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

          <WhatsappFloating />
          <Toaster />
          {/* <Announcement /> */}
        </Providers>
      </body>
    </html>
  );
}
