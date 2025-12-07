import { useAuthContext } from "@/context/auth-context";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { Coupon } from "@/types";
import { useQuery } from "@tanstack/react-query";

function useCoupon() {
  const { profile } = useAuthContext();
  const isOnline = profile?.type == 4;

  const { data, isLoading, error } = useQuery({
    queryKey: ["/students/profile/promo_code"],
    queryFn: getClientPrivateData as () => Promise<{ data: Coupon }>,
    enabled: profile && isOnline,
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
    showCoupon: isOnline && data && data?.data?.show_promo,
  };
}

export default useCoupon;
