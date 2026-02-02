"use client";

import PayFail from "@/components/modals/PayFail";
import { PaySuccess } from "@/components/modals/PaySuccess";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ReactConfetti from "react-confetti";
import { useModal } from "../../context/ModalProvider";

export default function RootLayout({ children }) {
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");

  const modal = useModal();
  const router = useRouter();

  useEffect(() => {
    if (payment == "success") {
      modal.setDialogContent(<PaySuccess />);
      modal.addSideElement(
        <ReactConfetti
          width={500}
          height={700}
          className="fixed inset-0 z-100000! w-full"
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
      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [modal, payment, router, searchParams]);

  return children;
}
