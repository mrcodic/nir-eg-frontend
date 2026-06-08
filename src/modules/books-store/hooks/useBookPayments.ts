import { useCartStore } from "@/context/BooksStoreProvider";
import { useModal } from "@/context/ModalProvider";
import { mutateClient } from "@/helpers/fetchers/post-client";
import { useToast } from "@/hooks/use-toast";
import usePaymentsTypesFiltered from "@/modules/payment/hooks/usePaymentsTypesFiltered";
import { paymentType, PricingResponse } from "@/types";
import { redirectUrl } from "@/utils/clientFun";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UsePaymentProps {
  bookId?: string | number;
  isSingleBook?: boolean;
  asModal?: boolean;
}

export const useBookPayment = ({
  bookId,
  isSingleBook = false,
  asModal = false,
}: UsePaymentProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const modal = useModal();

  const initialSelect = useRef(false);

  const cartId = useCartStore((state) => state.cartId);

  const [paymentMethodValue, setPaymentMethodValue] =
    useState<paymentType | null>(null);
  const [coupon, setCoupon] = useState<PricingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const { paymentTypes, isLoading: isLoadingFilter } = usePaymentsTypesFiltered(
    { isBookStore: true },
  );

  // Initialize payment method value
  useEffect(() => {
    if (paymentTypes.length > 0 && !initialSelect.current) {
      setPaymentMethodValue(paymentTypes[0].value);
      initialSelect.current = true;
    }
  }, [paymentTypes]);

  const handleCheckout = async () => {
    let response;

    setLoading(true);

    try {
      const endpoint = "/cart/pay";

      const [success_url, failure_url] = redirectUrl(
        isSingleBook ? { bookId } : { booksPage: true },
      );

      response = await mutateClient(endpoint, {
        body: {
          ...(isSingleBook ? { book_id: bookId } : { cart_id: cartId }),
          payment_method: paymentMethodValue,
          success_url,
          failure_url,
          // model_type: cartId ? "cart" : "book",
          // model_id: bookId || cartId,
          // coupon: coupon?.promo?.code || null,
        },
      });

      console.log("🛒 ~ cart checkout response", response);

      if (response?.payment_url) {
        router.push(response?.payment_url);
      } else {
        throw new Error("حصل مشكله اثناء الدفع");
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

    if (asModal) {
      modal.closeModal();
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
  };
};
