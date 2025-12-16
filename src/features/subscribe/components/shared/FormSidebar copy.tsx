"use client";

import { getPublicData } from "@/config/client-fetch";
import {
  IPricingPlan,
  PricingPlansApiResponse,
} from "@/types/pricing-api.types";
import type { FormVariant } from "@/types/subscribe.types";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

interface FormSidebarProps {
  variant: FormVariant;
  planId?: string;
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

function FormSidebar({ variant, planId }: FormSidebarProps) {
  const isDemo = variant === "demo";

  const { data } = useQuery({
    queryKey: [`/plans/${planId}`],
    queryFn: getPublicData as () => Promise<
      PricingPlansApiResponse<IPricingPlan>
    >,
  });

  const plan = data?.data;
  const features = isDemo ? demoFeatures : plan?.features || [];
  const seatCount = isDemo ? 586 : plan?.seats_included;

  return (
    <aside
      className={`
        hidden lg:flex flex-col h-fit justify-center items-center
        w-[min(360px,25vw)] p-4 text-white
        ${isDemo ? "bg-blue-gradient" : "bg-dark-radial"}
        rounded-lg
      `}
    >
      {/* Badge/Icon */}
      <div className="relative mb-6 flex items-center justify-center w-full">
        {isDemo ? (
          <Image
            src="/assets/demo-photo.png"
            alt="demo"
            width={224}
            height={224}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Image
              src="/assets/calendar.png"
              alt="paid"
              width={224}
              height={224}
            />
            <p className="text-2xl font-bold text-start w-full">
              {seatCount} مقعد
            </p>
          </div>
        )}
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-start mb-2 w-full">
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
      <p className="text-sm text-start text-white/80 mb-8">
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

export default memo(FormSidebar);
