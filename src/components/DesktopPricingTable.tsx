import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IPricingPlan } from "@/types/pricing-api.types";
import { Skeleton } from "./ui/skeleton";

interface DesktopPricingTableProps {
  plans: IPricingPlan[];
  visibleFeatures: string[];
  isLoading: boolean;
}

export function DesktopPricingTable({
  plans,
  visibleFeatures,
  isLoading,
}: DesktopPricingTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-t-xl">
      <table className="w-full bg-white" dir="rtl">
        <thead>
          <tr className="border-b-2 bg-background border-gray-300 min-w-full">
            <th className="py-3 px-8 text-right text-2xl lg:text-28 font-bold text-gray-900 min-w-[280px]  sticky right-0 z-20  bg-background">
              المميزات
            </th>

            {isLoading
              ? Array.from({ length: 4 }, (_, index) => (
                  <th
                    key={index}
                    className="py-2 px-1 text-center min-w-25   last:border-l-0"
                  >
                    <Skeleton className="h-12 w-full bg-gray-200" />
                  </th>
                ))
              : plans?.map((plan, index) => (
                  <th
                    key={index}
                    className="py-2 px-1 text-center min-w-25   last:border-l-0"
                  >
                    <a
                      href={`#plan-card-${plan.id}`}
                      className="flex justify-center w-full group"
                      title={plan.name}
                    >
                      <div className="h-12 w-full px-2 rounded-lg bg-primary-800 text-white flex flex-col items-center justify-center font-bold text-xs shadow-md group-hover:text-primary-800 group-hover:bg-white transition-all">
                        <span>{plan.name}</span>
                        <span className="text-10">
                          (حتى {plan.seats_included} طالب)
                        </span>
                      </div>
                    </a>
                  </th>
                ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            Array.from({ length: 4 }, (_, index) => (
              <tr key={index}>
                <td
                  colSpan={plans.length ? plans.length + 1 : 10}
                  className="pt-1"
                >
                  <Skeleton className="h-14 w-full" />
                </td>
              </tr>
            ))
          ) : !visibleFeatures.length ? (
            <tr>
              <td
                colSpan={plans.length ? plans.length + 1 : 10}
                className="py-4 px-8 text-center text-xl font-bold"
              >
                لا يوجد مميزات حالياً
              </td>
            </tr>
          ) : (
            visibleFeatures.map((feature, index) => (
              <motion.tr
                key={feature}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "border-b border-gray-200 hover:bg-blue-50/30 transition-colors",
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                )}
              >
                <td
                  className={cn(
                    "py-4 px-8 text-right text-base lg:text-lg font-bold text-gray-800 sticky right-0 bg-inherit z-10",
                    index % 2 === 0 ? "bg-white" : "bg-gray-50",
                  )}
                >
                  {feature}
                </td>

                {plans.map((plan) => {
                  const enabled = plan?.features?.[feature] || false;

                  return (
                    <td key={plan.id} className="py-4 px-2 text-center">
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
