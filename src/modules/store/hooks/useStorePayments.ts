import { useModal } from "@/context/ModalProvider";
import { useCartStore } from "@/context/StoreProvider";
import { useTenant } from "@/context/TenantProvider";
import { useAuthContext } from "@/context/auth-context";
import { mutateClient } from "@/helpers/fetchers/post-client";
import { getApiErrorMessage } from "@/helpers/get-api-error-message";
import { useToast } from "@/hooks/use-toast";
import usePaymentsTypesFiltered from "@/modules/payment/hooks/usePaymentsTypesFiltered";
import { paymentType, PricingResponse } from "@/types";
import { StoreItem } from "@/types/store.types";
import { redirectUrl } from "@/utils/clientFun";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

interface UsePaymentProps {
  item?: StoreItem;
  isSingleBook?: boolean;
  asModal?: boolean;
}

export const useStorePayments = ({
  item,
  isSingleBook = false,
  asModal = false,
}: UsePaymentProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const modal = useModal();
  const queryClient = useQueryClient();
  const { features } = useTenant();
  const { profile } = useAuthContext();

  const initialSelect = useRef(false);

  const { cartId, items, getItemQuantity, clearCart } = useCartStore();

  const [paymentMethodValue, setPaymentMethodValue] = useState<
    paymentType | "POINTS" | null
  >(null);
  const [coupon, setCoupon] = useState<PricingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const { paymentTypes: rawPaymentTypes, isLoading: isLoadingFilter } =
    usePaymentsTypesFiltered({ isBookStore: true });

  const hasPointsEnabled = !!features?.points_system;

  const pointsAllowed = useMemo(
    () =>
      isSingleBook
        ? !!(item?.can_buy_points && item?.points_price !== null)
        : items.length > 0 &&
          items.every((i) => i.can_buy_points && i.points_price !== null),
    [item, items, isSingleBook],
  );

  const totalPointsPrice = useMemo(
    () =>
      isSingleBook
        ? item?.points_price || 0
        : items.reduce(
            (sum, i) => sum + (i.points_price || 0) * (i.quantity || 1),
            0,
          ),
    [item, items, isSingleBook],
  );

  const hasEnoughPoints = (profile?.points || 0) >= totalPointsPrice;

  const paymentTypes = useMemo(() => {
    const list = [...rawPaymentTypes];
    if (hasPointsEnabled && pointsAllowed) {
      list.push({
        value: "POINTS" as any,
        label: `الدفع بالنقاط (${totalPointsPrice} نقطة) - رصيدك: ${profile?.points || 0} نقطة`,
        icons: ["/assets/star-colored.svg"],
        soon: false,
      });
    }
    return list;
  }, [
    rawPaymentTypes,
    hasPointsEnabled,
    pointsAllowed,
    totalPointsPrice,
    profile?.points,
  ]);

  // Initialize payment method value
  useEffect(() => {
    if (paymentTypes.length > 0 && !initialSelect.current) {
      setPaymentMethodValue(paymentTypes[0].value as any);
      initialSelect.current = true;
    }
  }, [paymentTypes]);

  const handleCheckout = async () => {
    let response;

    setLoading(true);

    try {
      const isPoints = paymentMethodValue === "POINTS";

      if (isPoints) {
        if (!hasEnoughPoints) {
          toast({
            description: "رصيد نقاطك غير كافٍ لإتمام عملية الشراء.",
            icon: "error",
          });
          return;
        }

        const endpoint = "/store/purchase-points";
        const body = isSingleBook
          ? {
              book_id: Number(item?.id),
              quantity: getItemQuantity(String(item?.id)) || 1,
            }
          : {
              items: items.map((i) => ({
                book_id: Number(i.id),
                quantity: i.quantity,
              })),
            };

        response = await mutateClient(endpoint, { body });
        toast({
          icon: "success",
          description: "تمت عملية الشراء بالنقاط بنجاح",
        });

        try {
          await clearCart();
        } catch (error) {
          toast({
            icon: "error",
            description: getApiErrorMessage(
              error,
              "تمت عملية الشراء، لكن تعذر تحديث السلة.",
            ),
          });
        }
        queryClient.invalidateQueries({ queryKey: ["/students/profile"] });

        if (asModal) {
          modal.closeModal();
        }
        router.push("/orders");
      } else {
        const endpoint = "/cart/pay";

        const [success_url, failure_url] = redirectUrl(
          isSingleBook ? { itemId: item?.id } : { booksPage: true },
        );

        response = await mutateClient(endpoint, {
          body: {
            ...(isSingleBook ? { book_id: item?.id } : { cart_id: cartId }),
            payment_method: paymentMethodValue,
            success_url,
            failure_url,
          },
        });

        // console.log("🛒 ~ cart checkout response", response);

        if (response?.payment_url) {
          router.push(response?.payment_url);
          toast({
            icon: "loading",
            description: "جاري التوجه لبوابة الدفع",
          });
        } else {
          throw new Error("حصل مشكله اثناء الدفع");
        }

        if (asModal && response?.payment_url) {
          modal.closeModal();
        }
      }
    } catch (e) {
      console.log(e);
      toast({
        description: "حصل مشكله اثناء الدفع",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    paymentMethodValue,
    setPaymentMethodValue,
    loading: loading || isLoadingFilter,
    paymentTypes,
    handleCheckout,
    coupon,
    setCoupon,
    totalPointsPrice,
    hasEnoughPoints,
  };
};
