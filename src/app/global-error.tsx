"use client";

import "./globals.css";

import { Almarai } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={cn(
          almarai.className,
          "bg-background text-foreground min-h-screen",
        )}
      >
        <main className="wrapper grid min-h-screen place-items-center">
          <div className="w-full max-w-md space-y-6 text-center">
            {/* Logo placeholder */}
            <div className="relative mx-auto size-38">
              {/* Replace src with your real logo */}
              <Image
                src="/logo.svg"
                alt="Company Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold">حدث خطأ غير متوقع</h1>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              نعتذر، حدثت مشكلة أثناء تحميل الصفحة. يمكنك المحاولة مرة أخرى أو
              التواصل معنا إذا استمرت المشكلة.
            </p>

            {/* Actions */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={reset} className="w-full sm:w-auto">
                حاول مرة أخرى
              </Button>

              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSPHONE}`}
                  target="_blank"
                >
                  تواصل معنا
                </Link>
              </Button>
            </div>

            {/* Optional debug info (hidden in prod) */}
            {process.env.NODE_ENV === "development" && (
              <pre className="bg-muted mt-6 overflow-auto rounded-lg p-4 text-left text-xs">
                {error.message}
              </pre>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
