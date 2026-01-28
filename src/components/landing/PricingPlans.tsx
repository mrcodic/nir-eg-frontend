"use client";

import { getPublicData } from "@/config/client-fetch";
import { cn } from "@/lib/utils";
import { type IPricingPlan } from "@/types/pricing-api.types";
import { PaymentPeriod } from "@/types/subscribe.types";
import { ApiResponse } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import Empty from "../Empty";
import LazyOnView from "../LazyOnView";
import MotionWrapper from "../MotionWrapper";
import PricingPlanCard from "../PricingPlanCard";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const PricingTypeSwtich = dynamic(() => import("../PricingTypeSwtich"), {
  ssr: false,
});

const MAX_VISIBLE_PLANS = 3;

export default function PricingPlans() {
  const [type, setType] = useState<PaymentPeriod>("yearly");

  const {
    data: pricingPlansResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/plans"],
    queryFn: () =>
      getPublicData<ApiResponse<IPricingPlan[]>>({
        queryKey: ["/plans"],
        next: {
          tags: ["/plans"],
          revalidate: 60,
        },
      }),
  });

  const { sortedPlans, visiblePlans, hasMorePlans } = useMemo(() => {
    const plans = pricingPlansResponse?.data || [];
    const sorted = [...plans].sort((a, b) => a.price_month - b.price_month);

    // If there are 3+ plans, rearrange to put main plan in center
    let arranged = sorted;
    if (sorted.length >= 3) {
      // Find the main/featured plan
      const mainPlanIndex = sorted.findIndex((plan) => plan.is_main);

      if (mainPlanIndex !== -1) {
        // Rearrange: [left, center(main), right]
        const mainPlan = sorted[mainPlanIndex];
        const otherPlans = sorted.filter((_, idx) => idx !== mainPlanIndex);

        // For 3 plans: put main in middle
        if (sorted.length === 3) {
          const [first, second] = otherPlans;
          arranged = [first, mainPlan, second];
        } else {
          // For 4+ plans: put main at index 1 (second position for visual center)
          arranged = [otherPlans[0], mainPlan, ...otherPlans.slice(1)];
        }
      }
    }

    const visible = arranged.slice(0, MAX_VISIBLE_PLANS);
    const hasMore = arranged.length > MAX_VISIBLE_PLANS;

    return {
      sortedPlans: arranged,
      visiblePlans: visible,
      hasMorePlans: hasMore,
    };
  }, [pricingPlansResponse]);

  if (!sortedPlans.length) return null;

  const isThreePlans = visiblePlans.length === 3;

  return (
    <section className="wrapper w-full relative text-center pb-12 space-y-6 min-h-[400px]">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-xl mb-2 md:text-2xl font-bold">خطط الأسعار</h2>

        {isLoading ? (
          <div className="flex flex-col items-center">
            <Skeleton className="h-8 mb-6 mt-4 w-36" />
            <div className="flex w-full mt-6 flex-col items-stretch lg:items-center xl:gap-6 lg:gap-4 gap-6 lg:flex-row lg:justify-center">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className={cn(
                    "max-w-md mx-auto relative flex-1 rounded-lg h-fit overflow-hidden backdrop-blur transition-transform duration-200 border-none shadow-none max-lg:w-full max-lg:mx-auto lg:min-w-[280px] p-4 min-h-[554px] lg:scale-95",
                    {
                      "z-10 lg:scale-105": index === 1,
                    },
                  )}
                />
              ))}
            </div>
          </div>
        ) : error || !pricingPlansResponse?.data ? (
          <Empty text="حدث خطاء اثناء عرض الخطة" isError />
        ) : (
          <>
            <LazyOnView className="min-h-8 mb-6 mt-4">
              <PricingTypeSwtich
                type={type}
                setType={setType}
                className="mb-6 mt-4"
              />
            </LazyOnView>

            <MotionWrapper
              className={cn(
                "flex flex-col items-stretch xl:gap-6 lg:gap-4 gap-6 lg:flex-row lg:justify-center",
                {
                  "lg:items-center": isThreePlans,
                },
              )}
              viewport={{ amount: 0.2, once: true }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5 },
              }}
              initial={{ opacity: 0, y: 20 }}
            >
              {visiblePlans.map((plan, index) => {
                const isMainPlan = plan.is_main;
                const shouldScale = isThreePlans && (isMainPlan || index === 1);

                return (
                  <PricingPlanCard
                    key={plan.id}
                    plan={plan}
                    type={type}
                    isThreePlans={shouldScale}
                  />
                );
              })}
            </MotionWrapper>

            {hasMorePlans && (
              <MotionWrapper
                className="mt-8 flex justify-center"
                viewport={{ amount: 0.2, once: true }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.3, delay: 0.2 },
                }}
                initial={{ opacity: 0, y: 10 }}
              >
                <Link href="/bundles">
                  <Button
                    variant="outline-primary"
                    size="lg"
                    className="min-w-[200px] font-bold"
                  >
                    عرض المزيد ({sortedPlans.length - MAX_VISIBLE_PLANS}+)
                  </Button>
                </Link>
              </MotionWrapper>
            )}
          </>
        )}
      </div>
    </section>
  );
}
