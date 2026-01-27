"use client";

import { IPricingPlan } from "@/types/pricing-api.types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export type PaymentPeriod = "monthly" | "yearly";

interface PricingPlansProps {
  plans: IPricingPlan[];
  type: PaymentPeriod;
}

export default function BundlesPricingPlans({
  plans,
  type,
}: PricingPlansProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-EG").format(price);
  };

  return (
    <div className="w-full mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const price = type === "monthly" ? plan.price_month : plan.price_year;
          const pricePerMonth =
            type === "yearly" ? plan.price_year / 12 : price;
          const discount =
            type === "yearly" && plan.price_year > 0
              ? Math.round((1 - plan.price_year / 12 / plan.price_month) * 100)
              : 0;

          return (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-xl p-4 overflow-hidden transition-all hover:shadow-md  duration-300 bg-background space-y-4",
              )}
            >
              {/* Plan Header */}
              <div className={cn("text-start border-b border-gray-light pb-3")}>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                <div className="flex items-center justify-start gap-2">
                  <Image
                    width={24}
                    height={24}
                    src="/assets/icons/compare-section-icons/users-fill.svg"
                    alt="arrow-down"
                  />
                  <span className="text-xl  text-black font-bold">
                    {plan.seats_included} طالب
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="text-start border-b border-gray-light pb-3">
                {price > 0 ? (
                  <>
                    {type === "yearly" && discount > 0 && (
                      <div className="text-sm text-gray-500 mb-1">
                        <span className="line-through">
                          {formatPrice(plan.price_month * 12)} جنيه
                        </span>
                      </div>
                    )}

                    <div className="flex items-baseline justify-start gap-2 mb-1">
                      <span className={cn("text-3xl font-bold text-secondary")}>
                        {formatPrice(Math.round(pricePerMonth))} جنيه
                      </span>
                      <span className="text-gray-600 text-3xl font-bold">
                        / شهر
                      </span>
                    </div>

                    {type === "yearly" && discount > 0 && (
                      <div className="text-xs text-green-600 font-medium">
                        وفر {discount}٪ مع الاشتراك السنوي
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-5xl font-bold text-green-600">
                    مجانًا
                  </div>
                )}
              </div>

              {/* Features - Three GB Items */}
              <div className="space-y-3 border-b border-gray-light pb-3">
                <FeatureRow
                  value={`GB ${plan.features.whatsapp_quota}`}
                  label="استهلاك الواتساب (GB):"
                />
                <FeatureRow
                  value={`GB ${plan.features.storage_gb}`}
                  label="مساحة التخزين (GB):"
                />
              </div>

              {/* CTA Button */}
              <div className="">
                <Link href={"#plans-table"}>
                  <Button
                    className="w-full border-primary-800 text-primary-800 font-bold text-base hover:bg-primary-800"
                    variant={"outline"}
                  >
                    قارن بين المميزات
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FeatureRow({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center flex-row-reverse justify-end" dir="rtl">
      <span className="text-lg font-bold text-black ">{value}</span>
      <span className="text-lg font-bold text-primary-800 ">{label}</span>
    </div>
  );
}
