"use client";

import Empty from "@/components/Empty";
import PricingPlanCard from "@/components/PricingPlanCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicData } from "@/config/client-fetch";
import {
  IPricingPlan,
  PricingPlansApiResponse,
} from "@/types/pricing-api.types";
import type { FormVariant, PaymentPeriod } from "@/types/subscribe.types";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

interface FormSidebarProps {
  variant: FormVariant;
  planId?: string;
  period?: PaymentPeriod;
}

function FormSidebar({ variant, planId, period }: FormSidebarProps) {
  const isDemo = variant === "demo";

  const { data, isLoading } = useQuery({
    queryKey: [`/plans/${planId}`],
    queryFn: getPublicData as () => Promise<
      PricingPlansApiResponse<IPricingPlan>
    >,
    enabled: !!planId,
  });

  const plan = data?.data;

  if (isLoading)
    return <Skeleton className="w-[min(360px,25vw)] h-full max-h-[768px]" />;

  if (!plan && !isLoading)
    return (
      <Empty
        className="w-[min(360px,25vw)] h-fit"
        text="حدث خطاء اثناء عرض تفاصيل الخطة"
        isError
      />
    );

  return (
    <PricingPlanCard plan={plan!} type={period} isDemo={isDemo} isOverview />
  );
}

export default memo(FormSidebar);
