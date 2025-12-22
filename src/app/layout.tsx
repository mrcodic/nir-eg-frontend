import Footer from "@/components/layout/Footer";
import NavBar from "@/components/layout/NavBar";
import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Providers from "./Providers";

const almarai = Almarai({
  subsets: ["arabic"],
  variable: "--font-almarai-sans",
  weight: ["300", "400", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "نَيِّر - منصة إدارة الحصص والطلاب",
    template: "%s | نَيِّر",
  },
  description:
    "منصة واحدة لإدارة الحصص و متابعة أداء الطلاب. احصل على منصة باسمك و اللوجو الخاص بك.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${almarai.variable}  antialiased flex flex-col`}
        suppressHydrationWarning
      >
        <Providers>
          <NavBar />
          <div className="min-h-[max(calc(100dvh-80px),500px)] mt-20 grow flex flex-col [&>*]:grow">
            {children}
          </div>
          <Footer />
        </Providers>

        <Toaster />
      </body>
    </html>
  );
}
