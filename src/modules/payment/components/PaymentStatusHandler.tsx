"use client";

import { useModal } from "@/context/ModalProvider";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PayFail from "@/components/modals/PayFail";
import { PaySuccess } from "@/components/modals/PaySuccess";

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

  useEffect(() => {
    if (payment == "success") {
      modal.setDialogContent(
        <PaySuccess title={successTitle} description={successDescription} />,
      );
      modal.openModal();
    } else if (payment == "failed") {
      modal.setDialogContent(
        <PayFail title={failTitle} description={failDescription} />,
      );
      modal.openModal();
    }

    if (payment == "failed" || payment == "success") {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("payment");
      const newUrl = `${pathname}?${newParams.toString()}`;
      router.replace(newUrl, { scroll: false });
    }
  }, [
    failDescription,
    failTitle,
    modal,
    pathname,
    payment,
    router,
    searchParams,
    successDescription,
    successTitle,
  ]);

  return null;
}

export default PaymentStatusHandler;
