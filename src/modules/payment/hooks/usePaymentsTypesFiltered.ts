import {
  paymentTypesBooks,
  paymentTypesCenter,
  paymentTypesOnline,
} from "@/constants";
import { useAuthContext } from "@/context/auth-context";
import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type PaymentFilter = {
  hide_fawry: number;
  hide_payment_code: number;
  hide_promo_code: number;
  hide_visa: number;
};

export const filterPaymentMethods = (
  paymentMethods: typeof paymentTypesOnline,
  filter: PaymentFilter,
) => {
  if (!filter) return paymentMethods;

  return paymentMethods.filter((item) => !filter[item.filter]);
};

function usePaymentsTypesFiltered({
  isBookStore,
}: { isBookStore?: boolean } = {}) {
  const { profile } = useAuthContext();

  const userType = profile?.type;

  const { data, isLoading } = useQuery<{ data: PaymentFilter | null }>({
    queryKey: ["settings/general"],
    queryFn: getClientPrivateData,
  });

  // helper: apply filter for userType === 4 (online user)

  // Determine payment types based on mode and user type
  const paymentTypes = useMemo(() => {
    if (isLoading || !profile || !data?.data) return [];
    if (userType === 4) {
      return filterPaymentMethods(
        isBookStore ? paymentTypesBooks : paymentTypesOnline,
        data?.data,
      );
    } else {
      return isBookStore
        ? filterPaymentMethods(paymentTypesBooks, data?.data)
        : paymentTypesCenter;
    }
  }, [isLoading, profile, userType, data?.data, isBookStore]);

  return {
    paymentFilter: data?.data,
    isLoading,
    paymentTypes,
  };
}

export default usePaymentsTypesFiltered;
