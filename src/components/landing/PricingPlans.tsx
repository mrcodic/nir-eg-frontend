"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Switch } from "../ui/switch";

type PricingPlan = {
  id: string;
  name: string;
  seatsLabel: string;
  pricePerMonth: string;
  trialLabel: string;
  features: string[];
  featured?: boolean;
};

const plans: PricingPlan[] = [
  {
    id: "left",
    name: "خطة أساسية",
    seatsLabel: "1000 مقعد",
    pricePerMonth: "30000",
    trialLabel: "التجربة المجانية: 14 يوم",
    features: [
      "هذا مثال عن النص يمكن أن يتم استبداله",
      "هذا مثال عن النص يمكن أن يتم استبداله",
      "هذا مثال عن النص يمكن أن يتم استبداله",
      "هذا مثال عن النص يمكن أن يتم استبداله",
      "هذا مثال عن النص يمكن أن يتم استبداله",
    ],
  },
  {
    id: "center",
    name: "الخطة الأكثر شهرة",
    seatsLabel: "1000 مقعد",
    pricePerMonth: "30000",
    trialLabel: "التجربة المجانية: 14 يوم",
    featured: true,
    features: [
      "هذا مثال عن النص يمكن أن يتم استبداله",
      "هذا مثال عن النص يمكن أن يتم استبداله",
      "هذا مثال عن النص يمكن أن يتم استبداله",
      "هذا مثال عن النص يمكن أن يتم استبداله",
      "هذا مثال عن النص يمكن أن يتم استبداله",
      "هذا مثال عن النص يمكن أن يتم استبداله",
    ],
  },
  {
    id: "right",
    name: "خطة متقدمة",
    seatsLabel: "1000 مقعد",
    pricePerMonth: "30000",
    trialLabel: "التجربة المجانية: 14 يوم",
    features: [
      "هذا مثال عن النص يمكن أن يتم استبداله",
      "هذا مثال عن النص يمكن أن يتم استبداله",
      "هذا مثال عن النص يمكن أن يتم استبداله",
      "هذا مثال عن النص يمكن أن يتم استبداله",
      "هذا مثال عن النص يمكن أن يتم استبداله",
    ],
  },
];

export default function PricingPlans() {
  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* header */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold ">خطط الأسعار</h2>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 p-1">
            <span>شهريا</span>
            <Switch dir="rtl" />
            <span>سنويا</span>
          </div>
        </div>

        {/* cards */}
        <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-end lg:justify-center">
          {plans.map((plan) => {
            const isFeatured = plan.featured;

            return (
              <Card
                key={plan.id}
                className={[
                  "relative flex-1 overflow-hidden   backdrop-blur transition-transform duration-200 border-none shadow-none max-w-md mx-auto p-4",
                  isFeatured
                    ? "z-10 scale-105   bg-dark-radial border-primary"
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
                      {plan.seatsLabel}
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
                    <div className="flex items-baseline justify-start gap-1 text-slate-900">
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

                    <Button
                      className="w-full"
                      size="lg"
                      variant={isFeatured ? "secondary" : "default"}
                    >
                      اشترك الآن
                    </Button>
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
