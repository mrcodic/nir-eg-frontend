import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { useToast } from "@/hooks/use-toast";
import { paymentType, PricingResponse } from "@/types";
import { redirectUrl } from "@/utils/clientFun";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import usePaymentsTypesFiltered from "./usePaymentsTypesFiltered";

interface UsePaymentProps {
  courseId?: string | number;
  bundleId?: string | number;
  roomId?: string | number;
  centerId?: string | number;
  isCodeCenter?: boolean;
  asModal?: boolean;
  setOpen?: (open: boolean) => void;
}

export const usePayment = ({
  courseId,
  bundleId,
  roomId,
  centerId,
  isCodeCenter,
  asModal = false,
}: UsePaymentProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const modal = useModal();
  const initialSelect = useRef(false);

  const { profile } = useAuthContext();

  const [paymentMethodValue, setPaymentMethodValue] =
    useState<paymentType | null>(null);
  const [coupon, setCoupon] = useState<PricingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch user data for modal mode

  const { paymentTypes, isLoading: isLoadingFilter } = usePaymentsTypesFiltered(
    {
      asModal,
      isCodeCenter,
      userType: profile?.type,
    },
  );

  // Initialize payment method value
  useEffect(() => {
    if (paymentTypes.length > 0 && !initialSelect.current) {
      setPaymentMethodValue(paymentTypes[0].value);
      initialSelect.current = true;
    }
  }, [paymentTypes]);

  // Cleanup loading state
  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const checkToken = async () => {
    let response = {};

    if (
      paymentMethodValue === paymentType.visa ||
      paymentMethodValue === paymentType.wallet ||
      paymentMethodValue === paymentType.fawerypay
    ) {
      try {
        const endpoint =
          paymentMethodValue === paymentType.fawerypay
            ? "/api?url=/payments/fawry/checkout"
            : "/api?url=/payment";

        response = await axios.post(endpoint, {
          model_id: courseId || bundleId,
          model_type: courseId ? "course" : "bundle",
          payment_method: paymentMethodValue,
          success_url: redirectUrl({ bundleId, courseId })[0],
          failure_url: redirectUrl({ bundleId, courseId })[1],
          coupon: coupon?.promo?.code || null,
        });

        console.log(response);

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
    }

    if (paymentMethodValue === paymentType.code) {
      if (courseId) {
        router.push(`/payment?courseId=${courseId}&type=${paymentMethodValue}`);
      } else if (bundleId) {
        router.push(`/payment?bundleId=${bundleId}&type=${paymentMethodValue}`);
      } else if (roomId) {
        router.push(
          `/payment?roomId=${roomId}&centerId=${centerId}&type=${paymentMethodValue}`,
        );
      }
    }

    if (asModal) {
      setTimeout(() => {
        modal.closeModal();
      }, 1000);
    }
  };

  const handleNextClick = async () => {
    setLoading(true);
    await checkToken();

    // setTimeout(() => {
    //   setLoading(false);
    // }, 1000);
  };

  return {
    paymentMethodValue,
    setPaymentMethodValue,
    loading,
    paymentTypes,
    handleNextClick,
    coupon,
    setCoupon,
    isLoadingMethods: isLoadingFilter || !profile,
  };
};
