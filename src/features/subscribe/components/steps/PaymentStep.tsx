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
import { UseFormReturn ,useWatch} from "react-hook-form";
import NavigationButtons from "../shared/NavigationButtons";

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
            <span className="text-white">إجمالي المبلغ</span>
            <span className="text-2xl font-bold text-white">
              {totalAmount?.toLocaleString("ar-EG")} جنية
            </span>
          </div>

          {paymentPeriod === "yearly" && (
            <p className="text-base text-green-50 font-bold mt-2">
              وفر{" "}
              {(
                ((plan?.price_month * 12 - plan?.price_year) /
                  (plan?.price_month * 12)) *
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
        <NavigationButtons
          onPrevious={onPrevious}
          isPending={isSubmitting}
          isLastStep={true}
        />
      </form>
    </Form>
  );
}
