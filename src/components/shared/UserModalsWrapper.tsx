"use client";

import { useAuthContext } from "@/context/auth-context";
import useHandleFeaturesDisplay from "@/hooks/useHandleFeaturesDisplay";
import useHandleOfferDisplay from "@/hooks/useHandleOfferDisplay";
import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

const ProfileCompletionModal = dynamic(
  () => import("@/modules/profile/components/ProfileCompletionModal"),
  { ssr: false },
);

const noModalPages = [
  "/exams",
  "/general-exams",
  "/assignment",
  "/short",
  "/parent-portal",
];

function UserModalsWrapper() {
  const { profile } = useAuthContext();
  const { handleFeaturesDisplay } = useHandleFeaturesDisplay();
  const { handleOfferDisplay } = useHandleOfferDisplay();
  const pathname = usePathname();
  const searchparams = useSearchParams();
  const isNoModalPage = noModalPages.some((page) => pathname.includes(page));

  const isOpened = useRef(false);
  const showingPaymentStatusModal =
    searchparams.get("payment") === "failed" ||
    searchparams.get("payment") === "success";

  useEffect(() => {
    if (isOpened.current || isNoModalPage || showingPaymentStatusModal) return;
    if (
      profile &&
      profile?.profile_completed === true &&
      profile?.student_phone_verification
    ) {
      handleFeaturesDisplay({
        onClose: () => {
          if (profile?.type === 4) {
            handleOfferDisplay();
          }
        },
      });
      isOpened.current = true;
    }
  }, [
    handleFeaturesDisplay,
    handleOfferDisplay,
    profile,
    pathname,
    isNoModalPage,
    showingPaymentStatusModal,
  ]);

  return (
    profile &&
    "profile_completed" in profile &&
    profile?.profile_completed === false &&
    !isNoModalPage && (
      <Suspense fallback={null}>
        <ProfileCompletionModal />
      </Suspense>
    )
  );
}

export default UserModalsWrapper;
