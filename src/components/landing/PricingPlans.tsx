"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { plans } from "@/constants/pricing-plans";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";
import PricingTypeSwtich from "../PricingTypeSwtich";

export default function PricingPlans() {
  return (
    <section className="wrapper w-full relative text-center pb-12 space-y-6">
      <div className="mx-auto max-w-7xl ">
        {/* header */}
        <PricingTypeSwtich />

        {/* cards */}
        <div className="flex flex-col items-stretch xl:gap-6 lg:gap-2 gap-6 lg:flex-row lg:items-end lg:justify-center">
          {plans.map((plan) => {
            const isFeatured = plan.featured;

            return (
              <Card
                key={plan.id}
                className={[
                  "relative flex-1 rounded-lg overflow-hidden   backdrop-blur transition-transform duration-200 border-none shadow-none max-w-md max-lg:w-full mx-auto p-4",
                  isFeatured
                    ? "z-10 lg:scale-105 max-lg:order-first bg-dark-radial "
                    : "lg:scale-95   bg-background",
                ].join(" ")}
              >
                {/* diagonal ribbon */}
                {isFeatured && (
                  <div className="pointer-events-none absolute -left-14 top-5 -rotate-45 bg-secondary px-12 py-1  font-semibold tracking-wide text-white shadow-md">
                    الأكثر شيوعًا
                  </div>
                )}

                <CardContent className="px-0 text-right">
                  {/* seats & trial */}
                  <div
                    className={cn("mb-6 border-b border-gray-light pb-2", {
                      "border-accent-800": isFeatured,
                    })}
                  >
                    <h4
                      className={cn("text-3xl font-bold  mb-2", {
                        "text-white": isFeatured,
                      })}
                    >
                      {plan.seats} مقعد
                    </h4>
                    <p
                      className={cn("text-lg font-bold text-gray-dark", {
                        "text-gray-light": isFeatured,
                      })}
                    >
                      {plan.trialLabel}
                    </p>
                  </div>

                  {/* features */}
                  <ul
                    className={cn(
                      "space-y-4 mb-6 border-b border-gray-light pb-2",
                      {
                        "border-accent-800": isFeatured,
                      }
                    )}
                  >
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-start gap-2 text-sm text-slate-700"
                      >
                        <span>
                          <Check className="size-5 text-emerald-500" />
                        </span>
                        <span
                          className={cn("ml-2 text-sm font-bold", {
                            "text-white": isFeatured,
                          })}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* price + CTA */}
                  <div className=" flex flex-col items-start gap-4">
                    <div
                      className={cn(
                        "flex items-baseline justify-start w-full gap-1 pb-2 border-b border-gray-light",
                        {
                          "border-accent-800": isFeatured,
                        }
                      )}
                    >
                      <span className="text-3xl text-secondary font-bold">
                        {plan.pricePerMonth}
                      </span>
                      <span
                        className={cn("text-lg  text-gray-dark", {
                          "text-white": isFeatured,
                        })}
                      >
                        جنيه /شهر
                      </span>
                    </div>

                    <Link
                      href={`/subscribe?type=paid&tier=${plan.id}`}
                      className="w-full"
                    >
                      <Button
                        className={cn("w-full font-bold", {
                          "border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white":
                            !isFeatured,
                        })}
                        size="lg"
                        variant="outline"
                      >
                        اشترك الآن
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
