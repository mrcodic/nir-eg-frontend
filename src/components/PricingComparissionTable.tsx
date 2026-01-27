"use client";

import { IPricingPlan } from "@/types/pricing-api.types";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FEATURES_IN_ORDER, getFeatureValue } from "@/lib/pricing-features";

interface PricingComparisonTableProps {
  plans: IPricingPlan[];
}

export function PricingComparisonTable({ plans }: PricingComparisonTableProps) {
  return (
    <div id="plans-table" className="w-full px-4 py-12 scroll-m-10">
      <div className="max-w-7xl mx-auto">
        {/* ================= Desktop View ================= */}
        <div className="hidden md:block overflow-x-auto rounded-xl shadow-xl border border-gray-200">
          <table className="w-full bg-white" dir="rtl">
            <thead>
              <tr className="bg-gradient-to-l from-blue-50 via-white to-gray-50 border-b-2 border-gray-300">
                <th className="py-6 px-8 text-right text-base font-bold text-gray-900 min-w-[280px] sticky right-0 bg-gradient-to-l from-blue-50 via-white to-gray-50 z-20 border-l border-gray-200">
                  المميزات
                </th>

                {plans.map((_, index) => (
                  <th
                    key={index}
                    className="py-6 px-4 text-center min-w-[120px] border-l border-gray-200 last:border-l-0"
                  >
                    <div className="flex justify-center">
                      <div className="h-10 w-10 rounded-lg bg-primary-800 text-white flex items-center justify-center font-bold text-lg shadow-md">
                        {index + 1}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {FEATURES_IN_ORDER.map((feature, featureIndex) => (
                <tr
                  key={feature.key}
                  className={cn(
                    "border-b border-gray-200 hover:bg-blue-50/30 transition-colors",
                    featureIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                  )}
                >
                  <td className="py-4 px-8 text-right text-sm font-medium text-gray-800 sticky right-0 bg-inherit z-10 border-l border-gray-200">
                    {feature.label}
                  </td>

                  {plans.map((plan) => {
                    const enabled = getFeatureValue(plan.features, feature.key);

                    return (
                      <td
                        key={plan.id}
                        className="py-4 px-4 text-center border-l border-gray-200 last:border-l-0"
                      >
                        <div className="flex justify-center">
                          {enabled ? (
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-4 h-4 text-green-600 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                              <X className="w-4 h-4 text-red-500 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= Mobile View ================= */}
        <div className="md:hidden space-y-6">
          {plans.map((plan, planIndex) => (
            <div
              key={plan.id}
              className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-primary-800 py-4 text-white text-center font-bold">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-sm">
                    {planIndex + 1}
                  </div>
                  {plan.name}
                </div>
              </div>

              {/* Features */}
              <div>
                {FEATURES_IN_ORDER.map((feature, featureIndex) => {
                  const enabled = getFeatureValue(plan.features, feature.key);

                  return (
                    <div
                      key={feature.key}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 border-gray-light border-b last:border-b-0",
                        featureIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                      )}
                    >
                      <span className="text-xs font-medium text-gray-800 text-right">
                        {feature.label}
                      </span>

                      {enabled ? (
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-600 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                          <X className="w-4 h-4 text-red-500 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center max-md:hidden">
          <Button
            size="lg"
            className=" font-bold px-10 py-6 text-base rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            عرض المزيد
          </Button>
        </div>
      </div>
    </div>
  );
}
