import Empty from "@/components/Empty";
import { CustomRadioGroup } from "@/components/fields";
import { FormLabel } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicData } from "@/config/client-fetch";
import { PaymentFormData } from "@/lib/schemas/subscribe.schema";
import { IPaymentOption } from "@/types/onboarding.types";
import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";

export default function PaymentOptions({
  form,
}: {
  form: UseFormReturn<PaymentFormData>;
}) {
  const { data, isLoading, error } = useQuery<{
    data: IPaymentOption[];
  } | null>({
    queryKey: ["settings/onboarding/payment-methods"],
    queryFn: getPublicData,
  });

  if (isLoading)
    return (
      <div className="space-y-5">
        <FormLabel>اختر طريقة الدفع</FormLabel>
        <div className="flex-col gap-3 flex">
          <Skeleton className="h-14 rounded-lg bg-gray-200" />
          <Skeleton className="h-14 rounded-lg bg-gray-200" />
          <Skeleton className="h-14 rounded-lg bg-gray-200" />
        </div>
      </div>
    );

  if (error || !data?.data?.length) {
    return (
      <Empty
        text={error ? "فشل تحميل طرق الدفع" : "لا توجد طرق دفع حالياً"}
        iconClassName="size-20"
        textClassName="md:text-lg"
        className="bg-gray-50 rounded-lg"
        isError={!!error}
      />
    );
  }

  return (
    <CustomRadioGroup
      form={form}
      name="paymentMethod"
      label="اختر طريقة الدفع"
      options={data?.data?.filter((x) => x?.enabled) || []}
      direction="vertical"
    />
  );
}
