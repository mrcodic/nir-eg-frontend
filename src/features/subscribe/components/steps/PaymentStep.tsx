"use client";

import Empty from "@/components/Empty";
import { CustomRadioGroup } from "@/components/fields";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/Spinner";
import { getPublicData } from "@/config/client-fetch";
import type { PaymentFormData } from "@/lib/schemas/subscribe.schema";
import { IPricingPlan } from "@/types/pricing-api.types";
import { ApiResponse } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UseFormReturn, useWatch } from "react-hook-form";
import NavigationButtons from "../shared/NavigationButtons";
import { useMemo } from "react";
import { priceFormatter } from "@/utils/formatters";

interface PaymentStepProps {
  form: UseFormReturn<PaymentFormData>;
  planId?: string;
  onSubmit: () => void;
  onPrevious: () => void;
  isSubmitting?: boolean;
}

const paymentPeriodOptions = [
  { value: "yearly", label: "سنوي" },
  { value: "monthly", label: "شهري" },
];

const paymentMethods = [
  {
    value: "e-wallet",
    label: "محفظة إلكترونية",
    icons: ["/assets/wallet.svg"],
  },
  { value: "bank-account", label: "حساب بنكي", icons: ["/assets/visa.svg"] },
];

export default function PaymentStep({
  form,
  planId,
  onSubmit,
  onPrevious,
  isSubmitting = false,
}: PaymentStepProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const paymentPeriod = useWatch({
    control: form.control,
    name: "paymentPeriod",
  });

  const { data, isLoading } = useQuery({
    queryKey: [`/plans/${planId}`],
    queryFn: getPublicData as () => Promise<ApiResponse<IPricingPlan>>,
  });

  const plan = data?.data;

  const yearlyDiscount = useMemo(
    () =>
      plan &&
      Math.min(
        Number(
          (
            ((plan?.price_month * 12 - plan?.price_year) /
              (plan?.price_month * 12)) *
            100
          ).toFixed(0),
        ),
        100,
      ),
    [plan],
  );

  if (isLoading) return <Spinner />;

  if (!plan) return <Empty text="حدث خطأ اثناء عرض بيانات الدفع" isError />;

  const totalAmount =
    paymentPeriod === "monthly" ? plan?.price_month : plan?.price_year;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        dir="rtl"
      >
        {/* Payment Period */}
        <CustomRadioGroup
          form={form}
          name="paymentPeriod"
          label="طريقة الدفع"
          options={paymentPeriodOptions}
          onChangeExtra={(value) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("period", value);
            router.replace(`${pathname}?${params.toString()}`, {
              scroll: false,
            });
          }}
        />

        {/* Total Amount Display */}
        <div className="p-4 bg-blue-gradient rounded-lg border border-primary-100">
          <div className="flex justify-between items-center">
            <span className="text-white font-bold sm:text-base text-sm">
              إجمالي المبلغ
            </span>
            <span className="sm:text-2xl text-xl font-bold text-secondary">
              {totalAmount?.toLocaleString("ar-EG")} جنية
              <span className="sm:text-base text-sm ms-1 text-white">
                / {paymentPeriod === "monthly" ? "شهر" : "سنة"}
              </span>
            </span>
          </div>

          {paymentPeriod === "yearly" ? (
            <div className="flex justify-between items-center gap-2 flex-wrap">
              <p className="sm:text-lg text-xs text-green-400 font-bold mt-2 ">
                وفر {yearlyDiscount}% مع الدفع السنوي!{" "}
                <span className="text-white line-through ms-2">
                  {priceFormatter.format(
                    plan?.price_month * 12 - plan?.price_year,
                  )}{" "}
                  جنية
                </span>
              </p>
              <p className="sm:text-lg text-xs text-green-400 font-bold mt-2 ">
                <span className="sm:text-sm text-xs font-bold text-white">
                  {priceFormatter.format(plan?.price_year / 12)} جنية
                  <span className="sm:text-10 text-[8px] ms-1 text-white">
                    / شهر
                  </span>
                </span>
              </p>
            </div>
          ) : (
            <div className="flex justify-between items-center gap-2 flex-wrap">
              <p className="sm:text-lg text-xs text-green-400 font-bold mt-2 ">
                وفر {yearlyDiscount}% مع الدفع السنوي!{" "}
              </p>

              <p className="sm:text-lg text-xs text-green-400 font-bold mt-2 ">
                <span className="sm:text-sm text-xs font-bold text-white">
                  {priceFormatter.format(plan?.price_month * 12)} جنية
                  <span className="sm:text-10 text-[8px] ms-1 text-white">
                    / سنه
                  </span>
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        <CustomRadioGroup
          form={form}
          name="paymentMethod"
          label="اختر طريقة الدفع"
          options={paymentMethods}
          direction="vertical"
        />

        {/* Navigation Buttons */}
        <NavigationButtons
          onPrevious={onPrevious}
          isPending={isSubmitting}
          isLastStep={true}
        />
      </form>
    </Form>
  );
}
