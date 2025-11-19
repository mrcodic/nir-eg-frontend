import { getDataClient } from "@/utils/clientFun";
import { useQuery } from "@tanstack/react-query";

type PaymentFilter = {
  hide_fawry: number;
  hide_payment_code: number;
  hide_promo_code: number;
  hide_visa: number;
};

function usePaymentsFilter() {
  const { data, isLoading } = useQuery({
    queryKey: ["settings/general"],
    queryFn: getDataClient,
  });

  console.log("🚀 ~ usePaymentsFilter ~ data:", data);

  return {
    data: data?.data as PaymentFilter | null,
    isLoading,
  };
}

export default usePaymentsFilter;
