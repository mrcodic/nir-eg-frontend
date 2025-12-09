"use client";

import { CustomRadioGroup } from "@/components/fields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { PaymentFormData } from "@/lib/validations/subscribe";
import type { PaidTier } from "@/types/subscribe";
import { UseFormReturn } from "react-hook-form";

interface PaymentStepProps {
  form: UseFormReturn<PaymentFormData>;
  tier?: PaidTier;
  onSubmit: () => void;
  onPrevious: () => void;
  isSubmitting?: boolean;
}

// Tier pricing
const tierPricing: Record<PaidTier, { monthly: number; yearly: number }> = {
  basic: { monthly: 500, yearly: 5000 },
  pro: { monthly: 1500, yearly: 15000 },
  enterprise: { monthly: 5000, yearly: 50000 },
};

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
  tier = "pro",
  onSubmit,
  onPrevious,
  isSubmitting = false,
}: PaymentStepProps) {
  const paymentPeriod = form.watch("paymentPeriod");

  const pricing = tierPricing[tier];
  const totalAmount =
    paymentPeriod === "monthly" ? pricing.monthly : pricing.yearly;

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
          label="فترة الدفع"
          options={paymentPeriodOptions}
        />

        {/* Total Amount Display */}
        <div className="p-4 bg-blue-gradient rounded-lg border border-primary-100">
          <div className="flex justify-between items-center">
            <span className="text-white">إجمالي المبلغ</span>
            <span className="text-2xl font-bold text-white">
              {totalAmount.toLocaleString("ar-EG")} جنية
            </span>
          </div>
          {paymentPeriod === "yearly" && (
            <p className="text-base text-green-50 font-bold mt-2">
              وفر{" "}
              {(
                ((pricing.monthly * 12 - pricing.yearly) /
                  (pricing.monthly * 12)) *
                100
              ).toFixed(0)}
              % مع الدفع السنوي!
            </p>
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
        <div className="flex gap-4 lg:justify-end justify-center pt-6">
          <Button
            type="submit"
            className="w-28 bg-primary-800 hover:bg-primary-800/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري الإرسال..." : "التالي"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-28 border-gray-light"
            onClick={onPrevious}
            disabled={isSubmitting}
          >
            السابق
          </Button>
        </div>
      </form>
    </Form>
  );
}
