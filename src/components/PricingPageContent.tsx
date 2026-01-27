"use client";

import { useState } from "react";
import { IPricingPlan } from "@/types/pricing-api.types";
import { PaymentPeriod } from "@/types/subscribe.types";
import BundlesPricingPlans from "./BundlesPricingPlans";
import PricingTypeSwtich from "./PricingTypeSwtich";

interface PricingPageContentProps {
  plans: IPricingPlan[];
}

export function PricingPageContent({ plans }: PricingPageContentProps) {
  const [type, setType] = useState<PaymentPeriod>("yearly");

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl  font-bold text-gray-900  tracking-tight">
          باقات الأسعار
        </h1>

        <PricingTypeSwtich type={type} setType={setType} />
      </div>

      {/* Pricing Plans Grid */}
      <BundlesPricingPlans plans={plans} type={type} />
    </div>
  );
}
