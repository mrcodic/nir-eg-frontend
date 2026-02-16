"use client";

import "./globals.css";

import { Almarai } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomError from "@/lib/customError";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const isTenantNotFoundError = (error: Error) => {
  return (
    error.name === "TenantNotFoundError" || error.message === "TENANT_NOT_FOUND"
  );
};

export default function CustomGlobalError({ error }: { error: CustomError }) {
  const isTenantError = isTenantNotFoundError(error);

  const title = isTenantError
    ? "الموقع غير موجود | NIR EDU"
    : "حدث خطأ غير متوقع | NIR EDU";

  const description = isTenantError
    ? "الموقع التعليمي الذي تحاول الوصول إليه غير موجود أو لم يتم إنشاؤه بعد. يمكنك إنشاء موقعك التعليمي الآن عبر NIR EDU."
    : "حدث خطأ غير متوقع أثناء تحميل الموقع. يرجى المحاولة مرة أخرى لاحقًا.";

  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Primary */}
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* Robots */}
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
            <h1 className="text-2xl font-bold">
              {isTenantError ? "الموقع غير موجود" : "حدث خطأ غير متوقع"}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isTenantError ? (
                <>
                  يبدو أن الرابط الذي تحاول الوصول إليه غير مرتبط بأي موقع
                  تعليمي حاليًا.
                  <br />
                  يمكنك إنشاء موقعك التعليمي الخاص أو الانضمام إلينا بسهولة.
                </>
              ) : (
                <>
                  نعتذر، حدثت مشكلة أثناء تحميل الصفحة.
                  <br />
                  يمكنك المحاولة مرة أخرى أو التواصل معنا إذا استمرت المشكلة.
                </>
              )}
            </p>

            {/* Actions */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              {isTenantError ? (
                <Button asChild className="w-full sm:w-auto">
                  <Link href="https://nir-edu.com/" target="_blank">
                    إنشاء موقع تعليمي الآن
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full sm:w-auto"
                >
                  حاول مرة أخرى
                </Button>
              )}

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
              <pre className="bg-muted mt-6 max-w-full overflow-auto rounded-lg p-4 text-left text-xs">
                {error.name}: {error.message}
              </pre>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
