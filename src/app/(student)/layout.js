"use client";
import PayFail from "@/components/modals/PayFail";
import { PaySuccess } from "@/components/modals/PaySuccess";
import AuthContext from "@/context/auth-context";
import { Cairo } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { CustomProvider } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { useModal } from "../../context/ModalProvider";
import "../globals.css";

const cairo = Cairo({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["700", "500"],
});

export default function RootLayout({ children }) {
  const { token } = useContext(AuthContext);
  const searchParams = useSearchParams();
  // const grade = searchParams.get("grade");
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
  }, [payment]);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     if (token) {
  //       if (grade == "1") {
  //         document.documentElement.style.setProperty(
  //           "--primary-color",
  //           "#012d5a"
  //         );
  //         document.documentElement.style.setProperty(
  //           "--overlay-primary",
  //           "rgba(1,32,66,0.8)"
  //         );
  //       } else if (grade == "2") {
  //         document.documentElement.style.setProperty(
  //           "--primary-color",
  //           "#a23a38"
  //         );

  //         document.documentElement.style.setProperty(
  //           "--overlay-primary",
  //           "rgba(78,30,37,.8)"
  //         );
  //       } else {
  //         document.documentElement.style.setProperty("--primary-color", "#000");
  //         document.documentElement.style.setProperty(
  //           "--overlay-primary",
  //           "rgba(2,45,45,.8)"
  //         );
  //       }
  //     }
  //   }
  // }, [grade, token]);
  return (
    <div className={`${cairo.className} antialiased`}>
      <CustomProvider>
        <div className="">{children}</div>
      </CustomProvider>
    </div>
  );
}
