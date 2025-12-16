"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicData } from "@/config/client-fetch";
import { cn } from "@/lib/utils";
import {
  ApiPricingPlan,
  PricingPlansApiResponse,
} from "@/types/pricing-api.types";
import { PaymentPeriod } from "@/types/subscribe.types";
import { getPlanFeaturesList } from "@/utils/pricing-helpers";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PricingTypeSwtich from "../PricingTypeSwtich";

const FEATURE_LIMIT = 7;

export default function PricingPlans() {
  const [type, setType] = useState<PaymentPeriod>("yearly");
  const [pricingPlans, setPricingPlans] = useState<ApiPricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPlans, setExpandedPlans] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data: PricingPlansApiResponse | null = await getPublicData({
          queryKey: ["/plans"],
          next: { tags: ["plans"] },
        });

        if (data?.status) {
          const sortedPlans = data.data.sort(
            (a, b) => a.price_month - b.price_month
          );
          setPricingPlans(sortedPlans.slice(0, 3));
        } else {
          setError(data?.message || "حدث خطأ اثناء تحميل الخطط");
        }
      } catch (err) {
        setError("حدث خطأ اثناء تحميل الخطط");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const toggleExpand = (planId: number) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  if (loading) {
    return (
      <section className="wrapper w-full relative text-center pb-12 space-y-6 min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-xl font-bold text-gray-400">
          جاري تحميل الخطط...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="wrapper w-full relative text-center pb-12 space-y-6 min-h-[400px] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </section>
    );
  }

  if (!pricingPlans.length) return null;

  return (
    <section className="wrapper w-full relative text-center pb-12 space-y-6">
      <div className="mx-auto max-w-7xl ">
        <PricingTypeSwtich type={type} setType={setType} />

        <div
          className={cn(
            "flex flex-col items-stretch xl:gap-6 lg:gap-4 gap-6 lg:flex-row lg:justify-center",
            {
              "lg:items-center": pricingPlans.length === 3,
            }
          )}
        >
          {pricingPlans.map((plan) => {
            const isFeatured = plan?.is_main;
            const isThreePlans = pricingPlans.length === 3;
            const features = getPlanFeaturesList(plan.features);
            const price =
              type === "yearly" ? plan.price_year : plan.price_month;
            const hasMoreFeatures = features.length > FEATURE_LIMIT;
            const isExpanded = expandedPlans[plan.id];
            const displayedFeatures =
              hasMoreFeatures && !isExpanded
                ? features.slice(0, FEATURE_LIMIT)
                : features;

            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative flex-1 rounded-lg h-fit overflow-hidden backdrop-blur transition-transform duration-200 border-none shadow-none max-lg:w-full max-w-lg lg:min-w-[280px] mx-auto p-4",
                  isFeatured ? "bg-dark-radial" : "bg-background",
                  {
                    "max-w-md": isThreePlans,
                    "z-10 lg:scale-105 max-lg:order-first":
                      isFeatured && isThreePlans,
                    "lg:scale-95": !isFeatured && isThreePlans,
                  }
                )}
              >
                {isFeatured && (
                  <div className="pointer-events-none absolute -left-14 top-5 -rotate-45 bg-secondary px-12 py-1 font-semibold tracking-wide text-white shadow-md">
                    الأكثر شيوعًا
                  </div>
                )}

                <CardContent className="px-0 text-right flex flex-col h-full">
                  <div
                    className={cn("mb-6 border-b border-gray-light pb-2", {
                      "border-accent-800": isFeatured,
                    })}
                  >
                    <h4
                      className={cn("text-3xl font-bold mb-2", {
                        "text-white": isFeatured,
                      })}
                    >
                      {plan.seats_included} مقعد
                    </h4>
                    <p
                      className={cn("text-lg font-bold text-gray-dark", {
                        "text-gray-light": isFeatured,
                      })}
                    >
                      التجربة المجانية: {plan.free_trial} يوم
                    </p>
                  </div>

                  {/* Features with blur effect */}
                  <div className="relative">
                    <ul className="space-y-4 pb-2">
                      {displayedFeatures.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-start gap-2 text-sm text-slate-700"
                        >
                          <span>
                            <Check className="size-5 text-emerald-500" />
                          </span>
                          <span
                            className={cn("ml-2 text-sm font-bold", {
                              "text-white": isFeatured,
                            })}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {hasMoreFeatures && (
                      <button
                        onClick={() => toggleExpand(plan.id)}
                        className={cn(
                          "flex items-center cursor-pointer  gap-2 text-sm font-semibold mt-2 mb-4 transition-colors ",
                          "text-secondary"
                        )}
                      >
                        {isExpanded ? (
                          <>
                            <span>عرض أقل</span>
                            <ChevronUp className="size-4" />
                          </>
                        ) : (
                          <>
                            <span>
                              عرض المزيد ({features.length - FEATURE_LIMIT}+)
                            </span>
                            <ChevronDown className="size-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div
                    className={cn(
                      "flex flex-col items-start gap-4 mt-auto pt-6 border-t border-gray-light",
                      {
                        "border-accent-800": isFeatured,
                      }
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-baseline justify-start w-full gap-1 pb-2 border-b border-gray-light",
                        {
                          "border-accent-800": isFeatured,
                        }
                      )}
                    >
                      <span className="text-3xl text-secondary font-bold">
                        {price}
                      </span>
                      <span
                        className={cn("text-lg text-gray-dark", {
                          "text-white": isFeatured,
                        })}
                      >
                        {type === "yearly" ? "جنيه /سنة" : "جنيه /شهر"}
                      </span>
                    </div>

                    <Link
                      href={`/subscribe?type=paid&tier=${plan.id}&period=${type}`}
                      className="w-full"
                    >
                      <Button
                        className={cn("w-full font-bold", {
                          "border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white":
                            !isFeatured,
                        })}
                        size="lg"
                        variant="outline"
                      >
                        اشترك الآن
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
