import { useAuthContext } from "@/context/auth-context";
import { Coupon } from "@/types";
import { getDataClient } from "@/utils/clientFun";
import { useQuery } from "@tanstack/react-query";

function useCoupon() {
  const { profile } = useAuthContext();
  const isOnline = profile?.type == 4;

  const { data, isLoading, error } = useQuery({
    queryKey: ["/students/profile/promo_code"],
    queryFn: getDataClient as () => Promise<{ data: Coupon }>,
    enabled: isOnline,
  });

  const discountValue =
    data?.data?.type_discount === 1
      ? `${data?.data?.price}%`
      : `${data?.data?.price} جنيه`;

  return {
    discountValue,
    isLoading,
    error,
    data: isOnline ? data?.data : null,
  };
}

export default useCoupon;
