"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function AppGlobalLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setIsLoading(true);

    // fallback عشان لو حصل أي redirect غريب ميفضلش loader للأبد
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 8000);
  };

  const stopLoading = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsLoading(false);
  };

  useEffect(() => {
    const handleStart = () => startLoading();

    window.addEventListener("app:navigation-start", handleStart);
    window.addEventListener("beforeunload", handleStart);

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");

      if (!href) return;
      if (targetAttr === "_blank") return;
      if (href.startsWith("#")) return;
      if (href.startsWith("mailto:")) return;
      if (href.startsWith("tel:")) return;

      const url = new URL(href, window.location.origin);

      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      startLoading();
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("app:navigation-start", handleStart);
      window.removeEventListener("beforeunload", handleStart);
      document.removeEventListener("click", handleClick, true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    stopLoading();
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-'999999' flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="border-primary h-14 w-14 animate-spin rounded-full border-4 border-t-transparent" />

        <div className="text-center">
          <p className="text-base font-bold text-slate-800">
            جارٍ التحميل...
          </p>
          <p className="mt-1 text-sm text-slate-500">
            برجاء الانتظار لحظات
          </p>
        </div>
      </div>
    </div>
  );
}