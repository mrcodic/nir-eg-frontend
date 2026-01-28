"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IPricingPlan } from "@/types/pricing-api.types";
import { Button } from "@/components/ui/button";
import { FEATURES_IN_ORDER } from "@/lib/pricing-features";
import { DesktopPricingTable } from "./DesktopPricingTable";
import { MobilePricingView } from "./MobilePricingView";
import { useParams, useSearchParams } from "next/navigation";

interface PricingComparisonTableProps {
  plans: IPricingPlan[];
}

const DEFAULT_VISIBLE_FEATURES = 5;

export function PricingComparisonTable({ plans }: PricingComparisonTableProps) {
  const [showAll, setShowAll] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const searchParams = useSearchParams();

  const visibleFeatures = showAll
    ? FEATURES_IN_ORDER
    : FEATURES_IN_ORDER.slice(0, DEFAULT_VISIBLE_FEATURES);

  // Sync with URL hash to select the correct plan
  useEffect(() => {
    const handleSearchChange = () => {
      const planId = searchParams.get("plan_id");

      if (
        !planId ||
        !plans.length ||
        !plans.some((p) => p.id === Number(planId))
      )
        return;

      const planIndex = plans.findIndex((p) => p.id === Number(planId));

      if (planIndex !== -1) {
        setSelectedPlanIndex(planIndex);
      }
    };

    // Handle initial Search on mount
    handleSearchChange();
  }, [plans, searchParams]);

  return (
    <div id="plans-table" className="w-full py-12 scroll-m-10">
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
