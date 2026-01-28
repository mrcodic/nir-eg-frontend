import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IPricingPlan } from "@/types/pricing-api.types";
import { getFeatureValue } from "@/lib/pricing-features";

interface DesktopPricingTableProps {
  plans: IPricingPlan[];
  visibleFeatures: Array<{ key: string; label: string }>;
}

export function DesktopPricingTable({
  plans,
  visibleFeatures,
}: DesktopPricingTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-t-xl">
      <table className="w-full bg-white" dir="rtl">
        <thead>
          <tr className="bg-background border-b-2 border-gray-300">
            <th className="py-6 px-8 text-right text-2xl lg:text-28 font-bold text-gray-900 min-w-[380px] sticky right-0 z-20 border-l border-gray-200 bg-background">
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
          {visibleFeatures.map((feature, featureIndex) => (
            <motion.tr
              key={feature.key}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: featureIndex * 0.05 }}
              className={cn(
                "border-b border-gray-200 hover:bg-blue-50/30 transition-colors",
                featureIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50",
              )}
            >
              <td
                className={cn(
                  "py-4 px-8 text-right text-base lg:text-lg font-bold text-gray-800 sticky right-0 bg-inherit z-10",
                  featureIndex % 2 === 0 ? "bg-white" : "bg-gray-50",
                )}
              >
                {feature.label}
              </td>

              {plans.map((plan) => {
                const enabled = getFeatureValue(plan.features, feature.key);

                return (
                  <td key={plan.id} className="py-4 px-4 text-center">
                    <div className="flex justify-center">
                      {enabled ? (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-600 stroke-3" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center">
                          <X className="w-4 h-4 text-red-500 stroke-3" />
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
