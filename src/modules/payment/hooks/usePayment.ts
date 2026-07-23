import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { mutateClient } from "@/helpers/fetchers/post-client";
import { useToast } from "@/hooks/use-toast";
import { paymentType, PricingResponse } from "@/types";
import { revalidateTagAction } from "@/utils/api";
import { redirectUrl } from "@/utils/clientFun";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import usePaymentsTypesFiltered from "./usePaymentsTypesFiltered";

interface UsePaymentProps {
  courseId?: string | number;
  bundleId?: string | number;
  roomId?: string | number;
  isCodeCenter?: boolean;
  asModal?: boolean;
  isFree?: boolean;
}

export const usePayment = ({
  courseId,
  bundleId,
  roomId,
  asModal = false,
  isFree = false,
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

  const { paymentTypes, isLoading: isLoadingFilter } =
    usePaymentsTypesFiltered();

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

  const handleNextClick = useCallback(async () => {
    if (loading && !isFree) return; // prevent double-click

    if (
      isFree ||
      paymentMethodValue === paymentType.visa ||
      paymentMethodValue === paymentType.wallet ||
      paymentMethodValue === paymentType.fawerypay
    ) {
      setLoading(true);

      try {
        const endpoint =
          isFree || paymentMethodValue === paymentType.fawerypay
            ? "/payments/fawry/checkout"
            : "/payment";

        const response = await mutateClient(endpoint, {
          body: {
            model_id: courseId || bundleId,
            model_type: courseId ? "course" : "bundle",
            payment_method: isFree ? paymentType.fawerypay : paymentMethodValue,
            success_url: redirectUrl({ bundleId, courseId })[0],
            failure_url: redirectUrl({ bundleId, courseId })[1],
            coupon: coupon?.promo?.code || null,
          },
        });

        if (isFree) {
          await Promise.all([
            revalidateTagAction("/students/classrooms"),
            revalidateTagAction("/students/bundles"),
          ]);

          if (asModal) {
            modal.closeModal();
          }
        }

        if (response?.payment_url) {
          const normalizedUrl = response?.payment_url.startsWith("http")
            ? response?.payment_url
            : `https://${response?.payment_url}`;

          router.push(normalizedUrl);

          toast({
            icon: "loading",
            description: "جاري التوجه لبوابة الدفع",
          });
        } else if (!isFree) {
          throw new Error("حصل مشكله اثناء الدفع");
        }

        if (asModal && response?.payment_url) {
          modal.closeModal();
        }
      } catch (e) {
        toast({
          description: isAxiosError(e)
            ? e?.response?.data?.message ||
              e?.response?.data?.error?.message ||
              "حصل مشكله اثناء الدفع"
            : "حصل مشكله اثناء الدفع",
          icon: "error",
        });
        if (asModal) {
          modal.closeModal();
        }
      } finally {
        setLoading(false);
      }
    }

    if (paymentMethodValue === paymentType.code) {
      if (courseId || roomId) {
        router.push(
          `/payment?courseId=${courseId}${roomId ? `&roomId=${roomId}` : ""}`,
        );
      } else if (bundleId) {
        router.push(`/payment?bundleId=${bundleId}`);
      }

      if (asModal) {
        modal.closeModal();
      }
    }
  }, [
    loading,
    isFree,
    paymentMethodValue,
    courseId,
    bundleId,
    coupon?.promo?.code,
    asModal,
    router,
    toast,
    modal,
    roomId,
  ]);

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
