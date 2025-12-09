"use client";

import type { FormVariant, PaidTier } from "@/types/subscribe";
import { Calendar, Check, Tag } from "lucide-react";

interface FormSidebarProps {
  variant: FormVariant;
  tier?: PaidTier;
}

const demoFeatures = [
  "هذا النص هو مثال لنص",
  "هذا النص هو مثال لنص",
  "هذا النص هو مثال لنص",
  "هذا النص هو مثال لنص",
  "هذا النص هو مثال لنص",
  "هذا النص هو مثال لنص",
  "هذا النص هو مثال لنص",
];

const paidFeatures = [
  "هذا النص هو مثال لنص",
  "هذا النص هو مثال لنص",
  "هذا النص هو مثال لنص",
  "هذا النص هو مثال لنص",
  "هذا النص هو مثال لنص",
  "هذا النص هو مثال لنص",
  "هذا النص هو مثال لنص",
];

const tierSeats: Record<PaidTier, number> = {
  basic: 500,
  pro: 1000,
  enterprise: 5000,
};

export default function FormSidebar({
  variant,
  tier = "pro",
}: FormSidebarProps) {
  const isDemo = variant === "demo";
  const features = isDemo ? demoFeatures : paidFeatures;
  const seatCount = tierSeats[tier];

  return (
    <aside
      className={`
        hidden lg:flex flex-col h-fit justify-center items-center
        w-[min(360px,25vw)] p-4 text-white
        ${isDemo ? "bg-blue-gradient" : "bg-dark-radial"}
        rounded-xl
      `}
    >
      {/* Badge/Icon */}
      <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
        {isDemo ? (
          <div className="relative">
            {/* Free badge icon */}
            <div className="w-24 h-28 relative">
              <Tag
                className="w-full h-full text-green-400 transform rotate-12"
                strokeWidth={1.5}
              />
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white transform rotate-12">
                FREE
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Calendar className="w-16 h-16 text-white mb-2" strokeWidth={1.5} />
            <span className="text-2xl font-bold">{seatCount} مقعد</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-center mb-2">
        {isDemo ? (
          <>
            احصل على <span className="text-secondary">النسخة التجريبية</span>
            <br />
            لنِيْر
          </>
        ) : (
          <>
            اشترك في <span className="text-secondary">الباقة المدفوعة</span>
            <br />
            لنِيْر
          </>
        )}
      </h2>

      {/* Subtitle */}
      <p className="text-sm text-center text-white/80 mb-8">
        {isDemo
          ? "ابدأ رحلتك مع نِيْر و احصل على النسخة التجريبية الآن"
          : "احصل على جميع المميزات واستمتع بتجربة كاملة"}
      </p>

      {/* Features List */}
      <ul className="space-y-3 w-full">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-sm">
            <Check className="w-4 h-4 text-secondary shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
