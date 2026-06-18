"use client";

import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { OTPNotVerifIed } from "../modals/OTPNotVerifIed";

export default function PhoneNotVerifiedGuard() {
  const modal = useModal();
  const pathname = usePathname();
  const { profile } = useAuthContext();
  const isOtpVerifyOpened = useRef(false);

  const hideOtpInPages = useMemo(
    () => ["/verify-otp", "/login"].some((path) => pathname.includes(path)),
    [pathname],
  );

  useEffect(() => {
    if (profile?.student_phone_verification) return;

    if (!!profile && !profile?.student_phone_verification && !hideOtpInPages) {
      modal.setDialogContent(
        <OTPNotVerifIed
          defaultPhone={{
            phone: profile.phone,
            country: `+${profile.code_country}`,
          }}
          showLogout
        />,
      );
      modal.setDialogContentProps({
        hideClose: true,
      });
      modal.openModal({ force: true, preventClose: true });
      isOtpVerifyOpened.current = true;
    } else if (hideOtpInPages && !!profile && isOtpVerifyOpened.current) {
      modal.closeModal();
      isOtpVerifyOpened.current = false;
    }
  }, [profile, modal, hideOtpInPages]);
  return null;
}
