import { paymentTypesCenter, paymentTypesOnline } from "@/constants";
import { useModal } from "@/context/ModalProvider";
import { useToast } from "@/hooks/use-toast";
import { IUser, paymentType, PricingResponse } from "@/types";
import { getDataClient, redirectUrl } from "@/utils/clientFun";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import usePaymentsFilter from "./usePaymentsFilter";

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
  setOpen,
}: UsePaymentProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const modal = useModal();
  const initialSelect = useRef(false);

  const [paymentMethodValue, setPaymentMethodValue] =
    useState<paymentType | null>(null);
  const [coupon, setCoupon] = useState<PricingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: filter, isLoading: isLoadingFilter } = usePaymentsFilter();

  // Fetch user data for modal mode
  const {
    data,
    isLoading: isLoadingMethods,
    error,
  } = useQuery({
    queryFn: getDataClient as () => Promise<{ body: IUser }>,
    queryKey: ["/students/profile"],
    enabled: asModal && !isLoadingFilter,
  });

  const userType = data?.body?.type;

  // 🔌 fetch payment filters (general settings)

  // helper: apply filter for userType === 4 (online user)
  const filterOnlineTypes = useCallback(
    (list: typeof paymentTypesOnline) => {
      if (!filter) return list;

      return list.filter((item) => !filter[item.filter]);
    },
    [filter]
  );

  // Determine payment types based on mode and user type
  const paymentTypes = useMemo(() => {
    if (isLoadingFilter && (userType === 4 || !isCodeCenter)) return [];
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
  }, [asModal, userType, isCodeCenter, filter, isLoadingFilter]);

  // Handle payment success/failure messages (modal mode)
  useEffect(() => {
    if (!asModal) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data === 200) {
        setOpen?.(false);
        toast({
          description: "تم الدفع بنجاح",
          icon: "success",
        });
        router.push(`/bundle/${bundleId}`);
      } else if (event.data === 500) {
        toast({
          description: "حصل مشكله اثناء الدفع",
          icon: "error",
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [asModal, bundleId, router, setOpen, toast]);

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
      // paymentMethodValue === paymentType.aman ||
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
          `/payment?roomId=${roomId}&centerId=${centerId}&type=${paymentMethodValue}`
        );
      }
    }

    if (asModal) {
      modal.closeModal();
    }
  };

  const handleNextClick = () => {
    setLoading(true);
    checkToken();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return {
    paymentMethodValue,
    setPaymentMethodValue,
    loading,
    paymentTypes,
    handleNextClick,
    coupon,
    setCoupon,
    isLoadingMethods: isLoadingMethods || isLoadingFilter || (!data && !error),
  };
};
