"use client";

import { Button } from "@/components/ui/button";
import type { SummaryTemplateLink } from "@/types/summary-template.types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Rocket } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SummaryMobileNavigationProps = {
  navigation: SummaryTemplateLink[];
  bookingLabel: string;
};

function SummaryMobileNavigation({
  navigation,
  bookingLabel,
}: SummaryMobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeMenuOnOutsidePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target) &&
        !menuTriggerRef.current?.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeMenuOnOutsidePointerDown);

    return () =>
      document.removeEventListener(
        "pointerdown",
        closeMenuOnOutsidePointerDown,
      );
  }, [isMenuOpen]);

  return (
    <>
      <Button
        ref={menuTriggerRef}
        variant="outline-gray"
        size="icon"
        className="size-11 rounded-xl lg:hidden"
        aria-label="فتح قائمة التنقل"
        aria-controls="summary-mobile-navigation"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      >
        <Menu aria-hidden />
      </Button>

      <AnimatePresence initial={false}>
        {isMenuOpen && (
          <motion.nav
            ref={menuRef}
            id="summary-mobile-navigation"
            dir="rtl"
            aria-label="التنقل في الصفحة"
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{
              duration: shouldReduceMotion ? 0.15 : 0.2,
              ease: "easeOut",
            }}
            className="absolute inset-x-0 top-[calc(100%+0.75rem)] grid gap-1 rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_20px_44px_-20px_rgba(18,48,75,0.45)] lg:hidden"
          >
            {navigation.map((link) =>
              link.hidden ? null : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:bg-primary-50 hover:text-primary-800 rounded-xl px-4 py-3 text-center text-sm font-bold transition-colors"
                >
                  {link.label}
                </Link>
              ),
            )}
            <Button asChild className="mt-1 h-11 rounded-xl">
              <Link
                href="#summary-booking"
                onClick={() => setIsMenuOpen(false)}
              >
                {bookingLabel}
                <Rocket aria-hidden />
              </Link>
            </Button>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

export default SummaryMobileNavigation;
