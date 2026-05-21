"use client";

import ProfileCompletionModal from "@/modules/profile/components/ProfileCompletionModal";
import { useAuthContext } from "@/context/auth-context";
import useHandleFeaturesDisplay from "@/hooks/useHandleFeaturesDisplay";
import useHandleOfferDisplay from "@/hooks/useHandleOfferDisplay";
import { useEffect, useRef } from "react";

function UserModalsWrapper() {
  const { profile } = useAuthContext();
  const { handleFeaturesDisplay } = useHandleFeaturesDisplay();
  const { handleOfferDisplay } = useHandleOfferDisplay();

  const isOpened = useRef(false);

  useEffect(() => {
    if (profile && profile?.profile_completed === true && !isOpened.current) {
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

  return <ProfileCompletionModal />;
}

export default UserModalsWrapper;
