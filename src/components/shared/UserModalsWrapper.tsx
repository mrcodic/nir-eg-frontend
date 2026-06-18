"use client";

import { useAuthContext } from "@/context/auth-context";
import useHandleFeaturesDisplay from "@/hooks/useHandleFeaturesDisplay";
import useHandleOfferDisplay from "@/hooks/useHandleOfferDisplay";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef } from "react";

const ProfileCompletionModal = dynamic(
  () => import("@/modules/profile/components/ProfileCompletionModal"),
  { ssr: false },
);

function UserModalsWrapper() {
  const { profile } = useAuthContext();
  const { handleFeaturesDisplay } = useHandleFeaturesDisplay();
  const { handleOfferDisplay } = useHandleOfferDisplay();

  const isOpened = useRef(false);

  useEffect(() => {
    if (
      profile &&
      profile?.profile_completed === true &&
      profile?.student_phone_verification &&
      !isOpened.current
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
  }, [handleFeaturesDisplay, handleOfferDisplay, profile]);

  return (
    profile &&
    "profile_completed" in profile &&
    profile?.profile_completed === false && (
      <Suspense fallback={null}>
        <ProfileCompletionModal />
      </Suspense>
    )
  );
}

export default UserModalsWrapper;
