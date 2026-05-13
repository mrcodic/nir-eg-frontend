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

export default function SuspendedTenant() {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Primary */}
        <title>الموقع غير مفعل | NIR EDU</title>
        <meta
          name="description"
          content="الموقع التعليمي الذي تحاول الوصول إليه غير مفعل. يرجى التواصل مع مدير الموقع أو دعم NIR EDU."
        />

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
            <div className="relative mx-auto aspect-square w-full max-w-71">
              <Image
                src="/assets/bg/suspended.png"
                alt="NIR EDU"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Title */}
            <h1 className="text-gradient-custom md:text-32 mt-4 text-2xl font-bold md:mt-8">
              لن تتمكن من الوصول لحسابك في المنصة
            </h1>

            {/* Description */}
            <p className="mt-6 text-sm leading-relaxed font-bold text-neutral-900 md:text-lg">
              يمكنك التواصل معنا من هنا لمعرفة سبب إيقاف حسابك و لتتمكن من
              الوصول لحسابك مرة أخرى
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
                  موقعنا
                </Link>
              </Button>
            </div>

            {/* Dev Debug */}
            {/* {process.env.NODE_ENV === "development" && (
              <pre className="bg-muted mt-6 overflow-auto rounded-lg p-4 text-left text-xs">
                {error.name}: {error.message}
              </pre>
            )} */}
          </div>
        </main>
      </body>
    </html>
  );
}
