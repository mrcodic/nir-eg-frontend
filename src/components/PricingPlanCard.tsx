"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IPricingPlan } from "@/types/pricing-api.types";
import { PaymentPeriod } from "@/types/subscribe.types";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MainPlanBadge from "./MainPlanBadge";

const FEATURE_LIMIT = 8;

interface PricingPlanCardProps {
  plan: IPricingPlan;
  type?: PaymentPeriod;
  isThreePlans?: boolean;
  isOverview?: boolean;
  isDemo?: boolean;
  className?: string;
  isMiddle?: boolean;
}

export default function PricingPlanCard({
  plan,
  type,
  isThreePlans = false,
  isOverview = false,
  isDemo = false,
  className,
  isMiddle = false,
}: PricingPlanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isFeatured = plan?.is_main;
  const features = Object.entries(plan.features);
  const price = type === "yearly" ? plan.price_year : plan.price_month;
  const hasMoreFeatures = features.length > FEATURE_LIMIT;
  const displayedFeatures =
    hasMoreFeatures && !isExpanded
      ? features.slice(0, FEATURE_LIMIT)
      : features;

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <Card
      className={cn(
        "relative",
        isOverview
          ? `overflow-hidden flex flex-col h-fit justify-center items-center
        lg:w-[min(360px,25vw)] p-4 border-none rounded-lg`
          : " flex-1 rounded-lg h-fit overflow-hidden backdrop-blur transition-transform duration-200 border-none shadow-none max-lg:w-full max-w-lg max-lg:mx-auto lg:min-w-[280px] p-4 min-h-[554px]",
        {
          "max-w-md mx-auto": isThreePlans,
          "z-10 lg:scale-105 max-lg:order-first":
            (isMiddle || isFeatured) && isThreePlans,
          "lg:scale-95": !isFeatured && !isMiddle && isThreePlans,
          "bg-dark-radial": !isDemo && isFeatured,
          "bg-background": !isDemo && !isFeatured,
          "bg-blue-gradient text-white": isDemo && !isFeatured,
          "bg-dark-radial text-white": isDemo && isFeatured,
        },
        className,
      )}
    >
      {/* Featured Badge */}
      {isFeatured && <MainPlanBadge />}

      <CardContent className="px-0 grow w-full text-right flex flex-col h-full">
        {/* Badge/Icon */}
        {isOverview && (
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
              </div>
            )}
          </div>
        )}
        {/* Header: Seats & Trial */}
        <div
          className={cn("mb-6 border-b border-gray-light pb-2", {
            "border-accent-800": isFeatured,
          })}
        >
          <h3
            className={cn("text-3xl font-bold mb-2", {
              "text-white": isFeatured,
            })}
          >
            {plan.seats_included} مقعد
          </h3>
          {/* <p
            className={cn("text-lg font-bold text-gray-dark", {
              "text-gray-light": isFeatured,
              "text-white": isDemo,
            })}
          >
            التجربة المجانية: {plan.free_trial} يوم
          </p> */}
        </div>

        {/* Features List */}
        {!!displayedFeatures?.length && (
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
                      "text-white": isFeatured || isDemo,
                    })}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* Expand/Collapse Button */}
            {hasMoreFeatures && (
              <button
                onClick={toggleExpand}
                className="flex items-center cursor-pointer gap-2 text-sm font-semibold mt-2 mb-4 transition-colors text-secondary hover:opacity-80"
              >
                {isExpanded ? (
                  <>
                    <span>عرض أقل</span>
                    <ChevronUp className="size-4" />
                  </>
                ) : (
                  <>
                    <span>عرض المزيد ({features.length - FEATURE_LIMIT}+)</span>
                    <ChevronDown className="size-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Price & CTA */}
        <div
          className={cn("flex flex-col items-start gap-4 mt-auto  ", {
            "border-t border-gray-light pt-6": !!displayedFeatures?.length,
            "border-accent-800": isFeatured,
          })}
        >
          <div
            className={cn("flex items-baseline justify-start w-full gap-1 ", {
              "pb-2 border-b border-gray-light": !isOverview,
              "border-accent-800": isFeatured,
            })}
          >
            {price > 0 ? (
              <>
                <span className="text-3xl text-secondary font-bold">
                  {price}
                </span>
                <span
                  className={cn("text-lg text-gray-dark", {
                    "text-white": isFeatured || isDemo,
                  })}
                >
                  {type === "yearly" ? "جنيه /سنة" : "جنيه /شهر"}
                </span>
              </>
            ) : (
              <span className="text-3xl text-secondary font-bold">مجاني</span>
            )}
          </div>

          {!isOverview && (
            <Link
              href={`/subscribe?type=paid&plan_id=${plan.id}&period=${type}`}
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
