"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Switch } from "./ui/switch";
import { AnimatePresence, motion } from "motion/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMemo } from "react";

function PricingTypeSwtich({
  type,
  setType,
  className,
}: {
  type: "monthly" | "yearly";
  setType: (type: "monthly" | "yearly") => void;
  className?: string;
}) {
  const [isMobile] = useMediaQuery("(max-width: 419px)");

  // Animation variants for badge
  const badgeVariants = useMemo(
    () => ({
      initial: isMobile ? { opacity: 0, y: 10 } : { opacity: 0, x: -10 },
      animate: isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 },
      exit: isMobile
        ? { opacity: 0, y: 20, transition: { delay: 0.1 } }
        : { opacity: 0, x: -20, transition: { delay: 0.1 } },
    }),
    [isMobile],
  );

  // Animation variants for arrow
  const arrowVariants = useMemo(
    () => ({
      initial: isMobile ? { opacity: 0, y: 10 } : { opacity: 0, x: -10 },
      animate: isMobile
        ? { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.3 } }
        : { opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.3 } },
      exit: isMobile
        ? { opacity: 0, y: 10, transition: { duration: 0.1 } }
        : { opacity: 0, x: -10, transition: { duration: 0.1 } },
    }),
    [isMobile],
  );

  return (
    <div className={cn("text-center ", className)}>
      <div className=" inline-flex items-center gap-2 rounded-full p-1">
        <div className="relative">
          <button
            className={cn("text-gray-dark font-bold", {
              "text-black": type === "monthly",
            })}
            onClick={() => setType("monthly")}
          >
            شهريا
          </button>

          {type === "monthly" && (
            <div className="bg-secondary h-0.5 w-full absolute" />
          )}
        </div>

        <Switch
          dir="rtl"
          aria-label="Pricing Type switch"
          onCheckedChange={(isChecked) => {
            setType(isChecked ? "yearly" : "monthly");
          }}
          checked={type === "yearly"}
          className="data-[state=checked]:bg-gray-light data-[state=unchecked]:bg-gray-light w-11 cursor-pointer h-6"
          thumbClassName="bg-primary-800 flex items-center justify-center border border-gray-light shrink-0 size-5.5 "
          thumbIcon={<Check className="size-4! stroke-white" />}
        />

        <div className="relative">
          <button
            className={cn("text-gray-dark font-bold", {
              "text-black": type === "yearly",
            })}
            onClick={() => setType("yearly")}
          >
            سنويا
          </button>
          <AnimatePresence mode="wait">
            {type === "yearly" && (
              <>
                <div className="bg-secondary h-0.5 w-full absolute" />

                <motion.span
                  initial={badgeVariants.initial}
                  animate={badgeVariants.animate}
                  exit={badgeVariants.exit}
                  className="text-sm absolute whitespace-nowrap h-8 min-[420px]:-left-29 bg-primary-800 text-white rounded-xl font-bold min-[420px]:-top-1 p-1.5 top-10 max-[420px]:right-1/2 max-[420px]:translate-x-1/2"
                >
                  خصم حتى 40%
                  {/* Arrow with delayed entrance and early exit */}
                  <motion.span
                    initial={arrowVariants.initial}
                    animate={arrowVariants.animate}
                    exit={arrowVariants.exit}
                    className="absolute min-[420px]:-right-5 w-4 min-[420px]:top-1/2 min-[420px]:-translate-y-1/2 border-8 right-1/2 -top-4.5 max-[420px]:translate-x-1/2 border-transparent min-[420px]:border-l-primary-800 max-[420px]:border-b-primary-800"
                  />
                </motion.span>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default PricingTypeSwtich;
