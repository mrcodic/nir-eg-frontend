"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IPricingPlan } from "@/types/pricing-api.types";
import { Button } from "@/components/ui/button";
import { FEATURES_IN_ORDER } from "@/lib/pricing-features";
import { DesktopPricingTable } from "./DesktopPricingTable";
import { MobilePricingView } from "./MobilePricingView";

interface PricingComparisonTableProps {
  plans: IPricingPlan[];
}

const DEFAULT_VISIBLE_FEATURES = 5;

export function PricingComparisonTable({ plans }: PricingComparisonTableProps) {
  const [showAll, setShowAll] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);

  const visibleFeatures = showAll
    ? FEATURES_IN_ORDER
    : FEATURES_IN_ORDER.slice(0, DEFAULT_VISIBLE_FEATURES);

  return (
    <div id="plans-table" className="w-full pt-12 scroll-m-10">
      <div>
        {/* ================= Desktop View ================= */}
        <DesktopPricingTable plans={plans} visibleFeatures={visibleFeatures} />

        {/* ================= Mobile View ================= */}
        <MobilePricingView
          plans={plans}
          visibleFeatures={visibleFeatures}
          selectedPlanIndex={selectedPlanIndex}
          onSelectPlan={setSelectedPlanIndex}
        />

        {/* ================= Show More/Less Button (Both Desktop & Mobile) ================= */}
        {FEATURES_IN_ORDER.length > DEFAULT_VISIBLE_FEATURES && (
          <div className="mt-12 text-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => setShowAll((prev) => !prev)}
                className="font-bold px-10 py-6 text-base border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white transition-all"
              >
                {showAll ? "عرض أقل" : "عرض المزيد"}
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
