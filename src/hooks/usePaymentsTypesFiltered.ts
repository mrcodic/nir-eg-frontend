import { paymentTypesCenter, paymentTypesOnline } from "@/constants";
import { getDataClient } from "@/utils/clientFun";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

type PaymentFilter = {
  hide_fawry: number;
  hide_payment_code: number;
  hide_promo_code: number;
  hide_visa: number;
};

function usePaymentsTypesFiltered({
  asModal = false,
  userType = 4,
  isCodeCenter = false,
}: {
  asModal?: boolean;
  userType?: number;
  isCodeCenter?: boolean;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["settings/general"],
    queryFn: getDataClient,
  });

  // helper: apply filter for userType === 4 (online user)
  const filterOnlineTypes = useCallback(
    (list: typeof paymentTypesOnline) => {
      if (!data) return list;

      return list.filter((item) => !data[item.filter]);
    },
    [data]
  );

  // Determine payment types based on mode and user type
  const paymentTypes = useMemo(() => {
    if (isLoading && (userType === 4 || !isCodeCenter)) return [];
    if (asModal) {
      if (userType === 4) {
        return filterOnlineTypes(paymentTypesOnline);
      } else if (userType === 3 || userType === 5) {
        return paymentTypesCenter;
      }
      return [];
    } else {
      return isCodeCenter
        ? paymentTypesCenter
        : filterOnlineTypes(paymentTypesOnline);
    }
  }, [asModal, userType, isCodeCenter, isLoading]);

  return {
    paymentFilter: data?.data as PaymentFilter | null,
    isLoading,
    paymentTypes,
  };
}

export default usePaymentsTypesFiltered;
