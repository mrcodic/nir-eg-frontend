"use client";

import { useModal } from "@/context/ModalProvider";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ReactConfetti from "react-confetti";
import PayFail from "./modals/PayFail";
import { PaySuccess } from "./modals/PaySuccess";

function PaymentStatusHandler() {
  const modal = useModal();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const payment = searchParams.get("payment");

  useEffect(() => {
    if (payment == "success") {
      modal.setDialogContent(<PaySuccess />);
      modal.addSideElement(
        <ReactConfetti
          width={500}
          height={700}
          className="fixed inset-0 z-100! w-full"
          gravity={0.3}
          recycle={false}
        />,
      );
      modal.openModal();
    } else if (payment == "failed") {
      modal.setDialogContent(<PayFail />);
      modal.openModal();
    }

    if (payment == "failed" || payment == "success") {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("payment");
      const newUrl = `${pathname}?${newParams.toString()}`;
      router.replace(newUrl, { scroll: false });
    }
  }, [modal, pathname, payment, router, searchParams]);

  return null;
}

export default PaymentStatusHandler;
