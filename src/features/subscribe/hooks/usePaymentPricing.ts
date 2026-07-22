import { axiosInstance } from "@/lib/axios-instance";
import type { PaymentPricingPreview } from "@/types/onboarding.types";
import type { PaymentPeriod } from "@/types/subscribe.types";
import type { ApiResponse } from "@/types/type";
import { useQuery } from "@tanstack/react-query";

export default function usePaymentPricing({
  planId,
  paymentPeriod,
}: {
  planId: number;
  paymentPeriod: PaymentPeriod;
}) {
  return useQuery({
    queryKey: ["/onboarding/pricing/preview", planId, paymentPeriod],
    queryFn: async (): Promise<PaymentPricingPreview> => {
      const response = await axiosInstance.post<ApiResponse<PaymentPricingPreview>>(
        `/onboarding/pricing/preview?plan_id=${planId}&type=${paymentPeriod}`,
      );

      return response.data.data;
    },
    enabled: Boolean(planId && paymentPeriod),
  });
}
