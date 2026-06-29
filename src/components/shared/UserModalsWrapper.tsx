"use client";

import { useAuthContext } from "@/context/auth-context";
import useHandleFeaturesDisplay from "@/hooks/useHandleFeaturesDisplay";
import useHandleOfferDisplay from "@/hooks/useHandleOfferDisplay";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

const ProfileCompletionModal = dynamic(
  () => import("@/modules/profile/components/ProfileCompletionModal"),
  { ssr: false },
);

const noModalPages = ["/exams", "/general-exams", "/assignment"];

function UserModalsWrapper() {
  const { profile } = useAuthContext();
  const { handleFeaturesDisplay } = useHandleFeaturesDisplay();
  const { handleOfferDisplay } = useHandleOfferDisplay();
  const pathname = usePathname();
  const isTaskPage = noModalPages.some((page) => pathname.includes(page));

  const isOpened = useRef(false);

  useEffect(() => {
    if (isOpened.current) return;
    if (isTaskPage) return;
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
    isTaskPage,
  ]);

  return (
    profile &&
    "profile_completed" in profile &&
    profile?.profile_completed === false &&
    !isTaskPage && (
      <Suspense fallback={null}>
        <ProfileCompletionModal />
      </Suspense>
    )
  );
}

export default UserModalsWrapper;
