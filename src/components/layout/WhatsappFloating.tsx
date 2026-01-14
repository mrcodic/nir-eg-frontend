"use client";

import Lottie from "@/lib/LottiesClient";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import whatsapp from "../../../public/assets/animations/whatsapp loop.json";
import { Button } from "../ui/button";

type Props = {
  message?: string;
  delayMs?: number;
  showOncePerSession?: boolean;
  position?: "left" | "right";
};

export default function WhatsAppFloating({
  message,
  delayMs = 2500,
  showOncePerSession = true,
  position,
}: Props) {
  const [open, setOpen] = useState(false);

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";

  const TEXT = {
    supportTeam: "فريق الدعم",
    close: "إغلاق",
    hello: "أهلًا 👋",
    modalLine1: "هل تحتاج إلى مساعدة؟",
    modalLine2: "تواصل معنا مباشرة عبر واتساب.",
    cta: "الدردشة على واتساب",
    prefillMessage: "مرحبًا، أحتاج إلى مساعدة",
    openWhatsapp: "فتح واتساب",
  };

  const finalMessage = message ?? TEXT.prefillMessage;

  const waUrl = useMemo(() => {
    const cleanPhone = phone.replace(/[^\d]/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
      finalMessage
    )}`;
  }, [phone, finalMessage]);

  const openWhatsApp = () => {
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const key = "wa_modal_shown_session";
    if (showOncePerSession && sessionStorage.getItem(key) === "1") return;

    const tmr = window.setTimeout(() => {
      setOpen(true);
      if (showOncePerSession) sessionStorage.setItem(key, "1");
    }, delayMs);

    return () => window.clearTimeout(tmr);
  }, [delayMs, showOncePerSession]);

  const resolvedPosition: "left" | "right" = position ?? "right";
  const sidePos = resolvedPosition === "left" ? "left-2" : "right-2";

  return (
    <>
      {/* MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div
            dir="rtl"
            className={`fixed bottom-22 ${sidePos} z-20 w-[280px] max-w-full`}
            initial={{
              opacity: 0,
              scale: 0.3,
              y: 48,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.3,
              y: 48,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
              mass: 0.9,
            }}
            style={{
              transformOrigin:
                resolvedPosition === "left" ? "bottom left" : "bottom right",
            }}
          >
            <div className="rounded-2xl bg-white dark:bg-surface shadow-lg ring-1 ring-black/5 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary-800" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {TEXT.supportTeam}
                  </span>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  aria-label={TEXT.close}
                  className="grid h-8 w-8 place-items-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="px-4 pb-4 text-right">
                <div className="mb-3 text-sm leading-6 text-gray-700 dark:text-white/80">
                  <div className="font-semibold">{TEXT.hello}</div>
                  <div className="mt-1">
                    {TEXT.modalLine1}
                    <br />
                    {TEXT.modalLine2}
                  </div>
                </div>

                <Button
                  onClick={openWhatsApp}
                  className="w-full rounded-lg px-4 py-3"
                  variant="animated-gradient"
                >
                  {TEXT.cta}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING WHATSAPP BUTTON */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={TEXT.openWhatsapp}
        className="fixed z-30 rounded-full cursor-pointer "
        style={{
          width: 80,
          height: 80,
          bottom: 8,
          ...(resolvedPosition === "left" ? { left: 2 } : { right: 2 }),
          background: "transparent",
        }}
      >
        <Lottie animationData={whatsapp} style={{ width: 80, height: 80 }} />
      </button>
    </>
  );
}
