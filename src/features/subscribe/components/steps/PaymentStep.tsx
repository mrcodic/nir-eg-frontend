"use client";

import Empty from "@/components/Empty";
import { CustomRadioGroup } from "@/components/fields";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/Spinner";
import { getPublicData } from "@/config/client-fetch";
import type { PaymentFormData } from "@/lib/schemas/subscribe.schema";
import type { CouponPreviewResponse } from "@/types/onboarding.types";
import { IPricingPlan } from "@/types/pricing-api.types";
import { ApiResponse } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import NavigationButtons from "../shared/NavigationButtons";
import PaymentCoupon from "./PaymentCoupon";
import PaymentOptions from "./PaymentOptions";
import PaymentSummary from "./PaymentSummary";

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

  const [couponPreview, setCouponPreview] =
    useState<CouponPreviewResponse | null>(null);

  useEffect(
    () => () => {
      form.setValue("coupon_code", undefined);
    },
    [form],
  );

  const { data, isLoading } = useQuery({
    queryKey: [`/plans/${planId}`],
    queryFn: getPublicData as () => Promise<ApiResponse<IPricingPlan>>,
  });

  const plan = data?.data;

  if (isLoading) return <Spinner />;

  if (!plan)
    return (
      <Empty
        text="حدث خطأ اثناء عرض بيانات الدفع"
        isError
        iconClassName="size-20"
        textClassName="md:text-lg"
        className="bg-gray-50 rounded-lg"
      />
    );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        dir="rtl"
      >
        <CustomRadioGroup
          form={form}
          name="paymentPeriod"
          label="طريقة الدفع"
          options={paymentPeriodOptions}
          onChangeExtra={(value) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("period", value);
            form.setValue("coupon_code", undefined);
            setCouponPreview(null);
            router.replace(`${pathname}?${params.toString()}`, {
              scroll: false,
            });
          }}
        />

        <PaymentSummary
          planId={plan.id}
          paymentPeriod={paymentPeriod}
          couponPreview={couponPreview}
        />

        {!plan.is_demo ? (
          <PaymentCoupon
            key={paymentPeriod}
            form={form}
            planId={plan.id}
            paymentPeriod={paymentPeriod}
            onCouponApplied={setCouponPreview}
            onCouponRemoved={() => setCouponPreview(null)}
          />
        ) : null}

        <PaymentOptions form={form} />

        <NavigationButtons
          onPrevious={onPrevious}
          isPending={isSubmitting}
          isLastStep={true}
        />
      </form>
    </Form>
  );
}
