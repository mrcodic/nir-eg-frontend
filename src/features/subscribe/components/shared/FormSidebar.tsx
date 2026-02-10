"use client";

import { NO_PLAN_ERROR } from "@/app/subscribe/error";
import PricingPlanCard from "@/components/PricingPlanCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicData } from "@/config/client-fetch";
import CustomError from "@/config/CustomError";
import { IPricingPlan } from "@/types/pricing-api.types";
import type { FormVariant, PaymentPeriod } from "@/types/subscribe.types";
import { ApiResponse } from "@/types/type";
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
    queryKey: [isDemo ? `/plans?is_demo=true` : `/plans/${planId}`],
    queryFn: getPublicData as () => Promise<
      ApiResponse<IPricingPlan | [IPricingPlan]>
    >,
    enabled: !!planId || isDemo,
  });

  const plan = isDemo ? (data?.data as [IPricingPlan])?.[0] : data?.data;

  if (isLoading)
    return <Skeleton className="w-[min(360px,25vw)] h-full max-h-[768px]" />;

  if (!plan && !isLoading) throw new CustomError(NO_PLAN_ERROR, 404);

  // if (!plan && !isLoading)
  //   return (
  //     <Empty
  //       className="w-[min(360px,25vw)] h-fit"
  //       text="حدث خطاء اثناء عرض تفاصيل الخطة"
  //       isError
  //     />
  //   );

  console.log("plan : ", plan);

  return (
    <PricingPlanCard
      plan={plan as IPricingPlan}
      type={period}
      isDemo={isDemo}
      isOverview
    />
  );
}

export default memo(FormSidebar);
