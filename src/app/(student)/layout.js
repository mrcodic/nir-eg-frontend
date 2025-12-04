"use client";
import PayFail from "@/components/modals/PayFail";
import { PaySuccess } from "@/components/modals/PaySuccess";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CustomProvider } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { useModal } from "../../context/ModalProvider";
import "../globals.css";

export default function RootLayout({ children }) {
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");

  const modal = useModal();
  const router = useRouter();

  useEffect(() => {
    if (payment == "success") {
      const grade = localStorage.getItem("grade");
      if (!grade) {
        console.log("grade doesnt exist in localstorage");
      }
      modal.setDialogContent(<PaySuccess grade={grade} />);
      modal.openModal();
    } else if (payment == "failed") {
      modal.setDialogContent(<PayFail />);
      modal.openModal();
    }
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("payment");
    router.replace(`?${newParams.toString()}`, { scroll: false });
  }, [modal, payment, router, searchParams]);

  return <CustomProvider>{children}</CustomProvider>;
}
