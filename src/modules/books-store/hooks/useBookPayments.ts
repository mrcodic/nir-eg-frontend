import { paymentTypesBooks } from "@/constants";
import { useCartStore } from "@/context/BooksStoreProvider";
import { useModal } from "@/context/ModalProvider";
import { useToast } from "@/hooks/use-toast";
import { paymentType, PricingResponse } from "@/types";
import { redirectUrl } from "@/utils/clientFun";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UsePaymentProps {
  bookId?: string | number;
  isSingleBook?: boolean;
  asModal?: boolean;
  setOpen?: (open: boolean) => void;
}

export const useBookPayment = ({
  bookId,
  isSingleBook = false,
  asModal = false,
  setOpen,
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

  const paymentTypes = paymentTypesBooks;

  // // Handle payment success/failure messages (popup window)
  // useEffect(() => {
  //   if (!asModal) return;

  //   const handleMessage = (event: MessageEvent) => {
  //     if (event.origin !== window.location.origin) return;
  //     if (event.data === 200) {
  //       setOpen?.(false);
  //       toast({
  //         description: "تم الدفع بنجاح",
  //         icon: "success",
  //       });
  //       router.push(`/books`);
  //     } else if (event.data === 500) {
  //       toast({
  //         description: "حصل مشكله اثناء الدفع",
  //         icon: "error",
  //       });
  //     }
  //   };

  //   window.addEventListener("message", handleMessage);
  //   return () => window.removeEventListener("message", handleMessage);
  // }, [asModal, bookId, router, setOpen, toast]);

  // Initialize payment method value
  useEffect(() => {
    if (paymentTypes.length > 0 && !initialSelect.current) {
      setPaymentMethodValue(paymentTypes[0].value);
      initialSelect.current = true;
    }
  }, [paymentTypes]);

  // Cleanup loading state
  // useEffect(() => {
  //   return () => {
  //     setLoading(false);
  //   };
  // }, []);

  const handleCheckout = async () => {
    let response = {};

    setLoading(true);

    try {
      // const endpoint = "/api?url=/payments/fawry/checkout";
      const endpoint = "/api?url=/cart/pay";

      const [success_url, failure_url] = redirectUrl(
        isSingleBook ? { bookId } : { booksPage: true }
      );

      response = await axios.post(endpoint, {
        ...(isSingleBook ? { book_id: bookId } : { cart_id: cartId }),
        payment_method: paymentMethodValue,
        // model_id: bookId || cartId,
        // model_type: cartId ? "cart" : "book",
        success_url,
        failure_url,
        // coupon: coupon?.promo?.code || null,
      });

      console.log("🛒 ~ cart checkout response", response);

      if (response?.data?.payment_url) {
        router.push(response?.data?.payment_url);
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
      setOpen?.(false);
    }
  };

  return {
    paymentMethodValue,
    setPaymentMethodValue,
    loading,
    paymentTypes,
    handleCheckout,
    coupon,
    setCoupon,
  };
};
