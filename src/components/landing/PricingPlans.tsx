"use client";

import { getPublicData } from "@/config/client-fetch";
import { cn } from "@/lib/utils";
import { IPricingPlan } from "@/types/pricing-api.types";
import { PaymentPeriod } from "@/types/subscribe.types";
import { ApiResponse } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import Empty from "../Empty";
import MotionWrapper from "../MotionWrapper";
import PricingPlanCard from "../PricingPlanCard";
import PricingTypeSwtich from "../PricingTypeSwtich";
import { Skeleton } from "../ui/skeleton";

export default function PricingPlans() {
  const [type, setType] = useState<PaymentPeriod>("yearly");

  const {
    data: pricingPlansResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/plans"],
    queryFn: getPublicData as () => Promise<ApiResponse<IPricingPlan[]>>,
  });

  const pricingPlans = useMemo(() => {
    return pricingPlansResponse?.data?.length == 3
      ? pricingPlansResponse?.data.sort((a, b) => a.price_month - b.price_month)
      : pricingPlansResponse?.data || [];
  }, [pricingPlansResponse]);

  if (!pricingPlans.length) return null;

  const isThreePlans = pricingPlans.length === 3;

  return (
    <section className="wrapper w-full relative text-center pb-12 space-y-6 min-h-[400px]">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-xl mb-2 md:text-2xl font-bold ">خطط الأسعار</h2>

        {isLoading ? (
          <div className="flex flex-col items-center">
            <Skeleton className="h-8 mb-6 w-36" />
            <div className="flex w-full flex-col items-stretch lg:items-center xl:gap-6 lg:gap-4 gap-6 lg:flex-row lg:justify-center">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className={cn(
                    "max-w-md mx-auto relative flex-1 rounded-lg h-fit overflow-hidden backdrop-blur transition-transform duration-200 border-none shadow-none max-lg:w-full max-lg:mx-auto lg:min-w-[280px] p-4 min-h-[554px] lg:scale-95",
                    {
                      "z-10 lg:scale-105 ": index === 1,
                    }
                  )}
                />
              ))}
            </div>
          </div>
        ) : error || !pricingPlansResponse?.data ? (
          <Empty text="حدث خطاء اثناء عرض الخطة" isError />
        ) : (
          <>
            <PricingTypeSwtich type={type} setType={setType} />

            <MotionWrapper
              className={cn(
                "flex flex-col items-stretch xl:gap-6 lg:gap-4 gap-6 lg:flex-row lg:justify-center",
                {
                  "lg:items-center": isThreePlans,
                }
              )}
              viewport={{ amount: 0.3, once: true }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5 },
              }}
              initial={{ opacity: 0, y: 20 }}
            >
              {pricingPlans.map((plan) => (
                <PricingPlanCard
                  key={plan.id}
                  plan={plan}
                  type={type}
                  isThreePlans={isThreePlans}
                />
              ))}
            </MotionWrapper>
          </>
        )}
      </div>
    </section>
  );
}
