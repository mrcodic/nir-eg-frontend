"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function useScrollToHash() {
  const pathname = usePathname();
  const scrolled = useRef(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || scrolled.current) return;

    const el = document.querySelector(hash);
    el?.scrollIntoView({ behavior: "smooth" });
    scrolled.current = true;
  }, [pathname]);
}
