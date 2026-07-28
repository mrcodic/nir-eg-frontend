"use client";

import PayFail from "@/components/modals/PayFail";
import { PaySuccess } from "@/components/modals/PaySuccess";
import { useModal } from "@/context/ModalProvider";
import { revalidateTagAction } from "@/utils/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

type Props = {
  successTitle?: string;
  successDescription?: string;
  failTitle?: string;
  failDescription?: string;
};

function PaymentStatusHandler({
  successTitle,
  successDescription,
  failTitle,
  failDescription,
}: Props) {
  const modal = useModal();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const payment = searchParams.get("payment");
  const shownPaymentStatus = useRef<string | null>(null);

  const clearPaymentSearchParam = useCallback(() => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.delete("payment");
    const search = updatedSearchParams.toString();

    router.replace(search ? `${pathname}?${search}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (payment !== "success" && payment !== "failed") {
      shownPaymentStatus.current = null;
      return;
    }

    if (shownPaymentStatus.current === payment) return;

    shownPaymentStatus.current = payment;

    if (payment == "success") {
      modal.setDialogContent(
        <PaySuccess title={successTitle} description={successDescription} />,
      );
      modal.openModal({ onClose: clearPaymentSearchParam });

      Promise.all([
        revalidateTagAction("/students/classrooms"),
        revalidateTagAction("/students/bundles"),
      ]);
    } else if (payment == "failed") {
      modal.setDialogContent(
        <PayFail title={failTitle} description={failDescription} />,
      );
      modal.openModal({ onClose: clearPaymentSearchParam });
    }
  }, [
    clearPaymentSearchParam,
    failDescription,
    failTitle,
    modal,
    payment,
    successDescription,
    successTitle,
  ]);

  return null;
}

export default PaymentStatusHandler;
