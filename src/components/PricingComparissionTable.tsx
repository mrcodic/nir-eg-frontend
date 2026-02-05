"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { IPricingPlan } from "@/types/pricing-api.types";
import { Button } from "@/components/ui/button";
import { DesktopPricingTable } from "./DesktopPricingTable";
import { MobilePricingView } from "./MobilePricingView";
import { useSearchParams } from "next/navigation";
import usePlanFeatures from "@/hooks/usePlanFeatures";
import { useScrollToHash } from "@/hooks/useScrollToHash";

interface PricingComparisonTableProps {
  plans: IPricingPlan[];
}

const DEFAULT_VISIBLE_FEATURES = 5;

export function PricingComparisonTable({ plans }: PricingComparisonTableProps) {
  const { features, isLoading } = usePlanFeatures();
  const [showAll, setShowAll] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const searchParams = useSearchParams();

  useScrollToHash();

  const sortedPlans = useMemo(() => {
    if (!plans.length) return [];
    return [...plans].sort((a, b) => {
      return a.seats_included - b.seats_included;
    });
  }, [plans]);

  const visibleFeatures = showAll
    ? features
    : features.slice(0, DEFAULT_VISIBLE_FEATURES);

  // Sync with URL hash to select the correct plan
  useEffect(() => {
    const handleSearchChange = () => {
      const planId = searchParams.get("plan_id");

      if (
        !planId ||
        !sortedPlans.length ||
        !sortedPlans.some((p) => p.id === Number(planId))
      )
        return;

      const planIndex = sortedPlans.findIndex((p) => p.id === Number(planId));

      if (planIndex !== -1) {
        setSelectedPlanIndex(planIndex);
      }
    };

    // Handle initial Search on mount
    handleSearchChange();
  }, [sortedPlans, searchParams]);

  return (
    <div id="plans-table" className="w-full py-12 scroll-m-10">
      <div>
        {/* ================= Desktop View ================= */}
        <DesktopPricingTable
          plans={sortedPlans}
          visibleFeatures={visibleFeatures}
          isLoading={isLoading}
        />

        {/* ================= Mobile View ================= */}
        <MobilePricingView
          plans={sortedPlans}
          visibleFeatures={visibleFeatures}
          selectedPlanIndex={selectedPlanIndex}
          onSelectPlan={setSelectedPlanIndex}
          isLoading={isLoading}
        />

        {/* ================= Show More/Less Button (Both Desktop & Mobile) ================= */}
        {features?.length > DEFAULT_VISIBLE_FEATURES && (
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
