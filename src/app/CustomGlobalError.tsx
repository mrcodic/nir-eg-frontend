"use client";

import "./globals.css";

import { Almarai } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import CustomError from "@/lib/customError";
import { getErrorMeta } from "@/lib/errorCodes";
import { cn } from "@/lib/utils";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export default function CustomGlobalError({
  error,
}: {
  error: CustomError | Error;
}) {
  const code = error instanceof CustomError ? error.code : "UNEXPECTED";
  const { title, description } = getErrorMeta(code);

  const pageTitle = `${title} | NIR EDU`;

  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <body
        className={cn(
          almarai.className,
          "bg-background text-foreground min-h-screen",
        )}
      >
        <main className="wrapper grid min-h-screen place-items-center">
          <div className="w-full max-w-md space-y-6 text-center">
            {/* Logo */}
            <div className="relative mx-auto size-38">
              <Image
                src="/logo.svg"
                alt="NIR EDU"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold">{title}</h1>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>

            {/* Actions */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
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

            {/* Dev Debug */}
            {process.env.NODE_ENV === "development" && (
              <pre className="bg-muted mt-6 max-w-full overflow-auto rounded-lg p-4 text-left text-xs break-all whitespace-break-spaces">
                [{code}] {error.message}
              </pre>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
