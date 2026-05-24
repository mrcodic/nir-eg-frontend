"use client";

import "./globals.css";

import { Almarai } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getErrorMeta } from "@/lib/errorCodes";
import { cn } from "@/lib/utils";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "الموقع غير موجود | NIR EDU",
  description:
    "يبدو أن الرابط الذي تحاول الوصول إليه غير مرتبط بأي موقع تعليمي حاليًا. يمكنك إنشاء موقعك التعليمي الخاص أو الانضمام إلينا بسهولة.",
  robots: "noindex, nofollow",
};

export default function NotFoundTenant() {
  const { title, description } = getErrorMeta("TENANT_NOT_FOUND");

  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Primary */}
        <title>{title} | NIR EDU</title>
        <meta name="description" content={description} />

        {/* Robots */}
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <body
        className={cn(
          almarai.className,
          "text-foreground min-h-screen bg-white",
        )}
      >
        <main className="wrapper grid min-h-screen place-items-center py-8">
          <div className="w-full text-center">
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
            <h1 className="text-gradient-custom md:text-32 mt-4 text-2xl font-bold md:mt-8">
              {title}
            </h1>

            {/* Description */}
            <p className="mt-6 text-sm leading-relaxed font-bold text-neutral-900 md:text-lg">
              يبدو أن الرابط الذي تحاول الوصول إليه غير مرتبط بأي موقع تعليمي
              حاليًا.
              <br />
              يمكنك إنشاء موقعك التعليمي الخاص أو الانضمام إلينا بسهولة.
            </p>

            {/* Actions */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                variant="secondary"
                asChild
                className="w-full max-w-[165px] rounded-xl"
              >
                <Link
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSPHONE}`}
                  target="_blank"
                >
                  تواصل معنا
                </Link>
              </Button>
              <Button asChild className="w-full max-w-[165px] rounded-xl">
                <Link href={`https://nir-edu.com`} target="_blank">
                  إنشاء موقع تعليمي
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
