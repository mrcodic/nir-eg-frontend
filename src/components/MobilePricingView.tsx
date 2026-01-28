"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IPricingPlan } from "@/types/pricing-api.types";

interface MobilePricingViewProps {
  plans: IPricingPlan[];
  visibleFeatures: string[];
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

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const el = tabRefs.current[selectedPlanIndex];
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedPlanIndex]);

  return (
    <div className="md:hidden">
      {/* ================= Tabs ================= */}
      {plans.length > 1 && (
        <div
          className="flex gap-2 mb-6 overflow-x-auto pb-2 scroll-smooth px-2"
          dir="rtl"
        >
          {plans.map((plan, index) => (
            <motion.button
              key={plan.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              onClick={() => onSelectPlan(index)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm whitespace-nowrap transition-all duration-200 shrink-0 border-2",
                selectedPlanIndex === index
                  ? "bg-primary-800 border-secondary text-white shadow-md "
                  : "bg-white text-gray-700  border-gray-200 hover:border-primary-800/50",
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

      {/* ================= Selected Plan Card ================= */}
      <AnimatePresence mode="wait">
        {selectedPlan && (
          <motion.div
            key={selectedPlan.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
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
              {!visibleFeatures.length ? (
                <div className="py-4 px-8 text-center text-lg font-bold">
                  لا يوجد مميزات حالياً
                </div>
              ) : (
                visibleFeatures.map((feature, featureIndex) => {
                  const enabled = selectedPlan?.features?.[feature] || false;

                  return (
                    <div
                      key={feature}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 border-gray-light border-b last:border-b-0",
                        featureIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                      )}
                    >
                      <span className="text-xs font-medium text-gray-800 text-right">
                        {feature}
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
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
