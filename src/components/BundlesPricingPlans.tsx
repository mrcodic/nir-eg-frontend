"use client";

import { useMemo, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { IPricingPlan } from "@/types/pricing-api.types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import MainPlanBadge from "./MainPlanBadge";

export type PaymentPeriod = "monthly" | "yearly";

interface PricingPlansProps {
  plans: IPricingPlan[];
  type: PaymentPeriod;
}

/* ================= Animation Variants ================= */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut" as const,
    },
  },
};

const badgeVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
    y: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut" as const,
      delay: 1,
    },
  },
};

const priceFormatter = new Intl.NumberFormat("ar-EG");

export default function BundlesPricingPlans({
  plans,
  type,
}: PricingPlansProps) {
  /* ================= InView ================= */

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: "-80px",
  });

  /* ================= Sort main plan first ================= */

  const sortedPlans = useMemo(() => {
    if (!plans.length) return plans;
    return [...plans].sort((a, b) => {
      if (a.is_main === b.is_main) return 0;
      return a.is_main ? -1 : 1;
    });
  }, [plans]);

  return (
    <div className="w-full mt-10">
      <motion.div
        ref={containerRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-7xl mx-auto"
      >
        {sortedPlans.map((plan) => {
          const isYearly = type === "yearly";
          const price = isYearly ? plan.price_year : plan.price_month;
          const pricePerMonth = isYearly
            ? plan.price_year / 12
            : plan.price_month;

          const discount =
            isYearly && plan.price_year > 0 && plan.price_month > 0
              ? Math.round((1 - plan.price_year / 12 / plan.price_month) * 100)
              : 0;

          return (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              className={cn(
                "relative rounded-xl p-4 overflow-hidden bg-background space-y-4",
                "transition-shadow duration-300 hover:shadow-md",
              )}
            >
              {plan.is_main && (
                <motion.div
                  variants={badgeVariants}
                  className="absolute inset-0 pointer-events-none"
                >
                  <MainPlanBadge />
                </motion.div>
              )}

              {/* ================= Header ================= */}
              <div className="text-start border-b border-gray-light pb-3">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                <div className="flex items-center gap-2">
                  <Image
                    width={24}
                    height={24}
                    src="/assets/icons/compare-section-icons/users-fill.svg"
                    alt="students"
                  />
                  <span className="text-xl font-bold text-black">
                    {plan.seats_included} طالب
                  </span>
                </div>
              </div>

              {/* ================= Pricing ================= */}
              <div className="text-start border-b border-gray-light pb-3">
                {price > 0 ? (
                  <>
                    {isYearly && discount > 0 && (
                      <div className="text-sm text-gray-500 mb-1">
                        <span className="line-through">
                          {priceFormatter.format(plan.price_month * 12)} جنيه
                        </span>
                      </div>
                    )}

                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-secondary">
                        {priceFormatter.format(Math.round(pricePerMonth))} جنيه
                      </span>
                      <span className="text-3xl font-bold text-gray-600">
                        / شهر
                      </span>
                    </div>

                    {isYearly && discount > 0 && (
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

              {/* ================= Features ================= */}
              <div className="space-y-3 border-b border-gray-light pb-3">
                <FeatureRow
                  value={`GB ${plan.features.whatsapp_quota}`}
                  label="استهلاك الواتساب:"
                />
                <FeatureRow
                  value={`GB ${plan.features.storage_gb}`}
                  label="مساحة التخزين:"
                />
              </div>

              {/* ================= CTA ================= */}
              <div>
                <Link
                  href={`/subscribe?period=${type}&type=paid&plan_id=${plan.id}`}
                >
                  <Button
                    variant="outline"
                    className="w-full h-11 border-primary-800 text-primary-800 font-bold text-base hover:bg-primary-800 hover:text-white transition"
                  >
                    اشترك الآن
                  </Button>
                </Link>

                <Link
                  href="#plans-table"
                  className="mt-4 flex h-11 items-center justify-center text-primary-800 font-bold underline"
                >
                  قارن بين المميزات
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ================= Small Pure Component ================= */

function FeatureRow({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-row-reverse items-center justify-end" dir="rtl">
      <span className="text-lg font-bold text-black">{value}</span>
      <span className="text-lg font-bold text-primary-800">{label}</span>
    </div>
  );
}
