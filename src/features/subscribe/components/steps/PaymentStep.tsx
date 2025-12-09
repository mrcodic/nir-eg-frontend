"use client";

import { CustomInput, CustomRadioGroup } from "@/components/fields";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
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
    icons: ["Visa", "MasterCard"],
  },
  { value: "bank-account", label: "حساب بنكي", icons: ["CIB", "Fawry"] },
];

export default function PaymentStep({
  form,
  tier = "pro",
  onSubmit,
  onPrevious,
  isSubmitting = false,
}: PaymentStepProps) {
  const paymentPeriod = form.watch("paymentPeriod");
  const paymentMethod = form.watch("paymentMethod");

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
        <div className="p-4 bg-primary-100/30 rounded-lg border border-primary-100">
          <div className="flex justify-between items-center">
            <span className="text-gray-dark">إجمالي المبلغ</span>
            <span className="text-2xl font-bold text-primary-800">
              {totalAmount.toLocaleString("ar-EG")} جنية
            </span>
          </div>
          {paymentPeriod === "yearly" && (
            <p className="text-sm text-green-600 mt-2">
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
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>اختر طريقة الدفع</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => field.onChange(method.value)}
                      className={cn(
                        "w-full p-4 rounded-lg border-2 text-right transition-all",
                        paymentMethod === method.value
                          ? "border-primary-800 bg-primary-100/20"
                          : "border-gray-light hover:border-primary-800/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{method.label}</span>
                        <div className="flex gap-2">
                          {method.icons.map((icon) => (
                            <div
                              key={icon}
                              className="w-10 h-6 bg-white rounded border flex items-center justify-center"
                            >
                              <span className="text-xs text-gray-dark">
                                {icon}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Details */}
        {paymentMethod && (
          <CustomInput
            form={form}
            name="paymentDetails"
            label={
              paymentMethod === "e-wallet" ? "رقم المحفظة" : "رقم الحساب البنكي"
            }
            placeholder={
              paymentMethod === "e-wallet"
                ? "أدخل رقم المحفظة الإلكترونية"
                : "أدخل رقم الحساب البنكي"
            }
            dir="ltr"
            className="text-left"
          />
        )}

        {/* Payment Icons Summary */}
        <div className="flex items-center justify-center gap-4 py-4">
          {["Visa", "MasterCard", "CIB", "Fawry"].map((icon) => (
            <div
              key={icon}
              className="w-12 h-8 bg-white rounded border flex items-center justify-center"
            >
              <span className="text-xs font-medium text-gray-dark">{icon}</span>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-center pt-6">
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
            className="w-28"
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
