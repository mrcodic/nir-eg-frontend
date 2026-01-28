import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IPricingPlan } from "@/types/pricing-api.types";
import { getFeatureValue } from "@/lib/pricing-features";

interface MobilePricingViewProps {
  plans: IPricingPlan[];
  visibleFeatures: Array<{ key: string; label: string }>;
  selectedPlanIndex: number;
  onSelectPlan: (index: number) => void;
}

export function MobilePricingView({
  plans,
  visibleFeatures,
  selectedPlanIndex,
  onSelectPlan,
}: MobilePricingViewProps) {
  const selectedPlan = plans[selectedPlanIndex] || plans[0];

  return (
    <div className="md:hidden">
      {/* Tabs/Buttons - Only show if more than one plan */}
      {plans.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2" dir="rtl">
          {plans.map((plan, index) => (
            <motion.button
              key={plan.id}
              onClick={() => onSelectPlan(index)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm whitespace-nowrap transition-all duration-200 shrink-0",
                selectedPlanIndex === index
                  ? "bg-primary-800 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-800/50",
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold",
                  selectedPlanIndex === index
                    ? "bg-white/20 text-white"
                    : "bg-primary-800/10 text-primary-800",
                )}
              >
                {index + 1}
              </div>
              {plan.name}
            </motion.button>
          ))}
        </div>
      )}

      {/* Selected Plan Card */}
      <AnimatePresence mode="wait">
        {selectedPlan && (
          <motion.div
            key={selectedPlan.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary-800 py-4 text-white text-center font-bold">
              <div className="flex items-center justify-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-sm">
                  {selectedPlanIndex + 1}
                </div>
                {selectedPlan.name}
              </div>
            </div>

            {/* Features */}
            <div>
              {visibleFeatures.map((feature, featureIndex) => {
                const enabled = getFeatureValue(
                  selectedPlan.features,
                  feature.key,
                );

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
                        <Check className="w-4 h-4 text-green-600 stroke-3" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                        <X className="w-4 h-4 text-red-500 stroke-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
