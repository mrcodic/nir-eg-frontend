"use client";

import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import useHandleFeaturesDisplay from "@/hooks/useHandleFeaturesDisplay";
import useHandleOfferDisplay from "@/hooks/useHandleOfferDisplay";
import { useEffect, useRef } from "react";

function UserModalsWrapper() {
  const modal = useModal();
  const { profile } = useAuthContext();
  const { handleFeaturesDisplay } = useHandleFeaturesDisplay();
  const { handleOfferDisplay } = useHandleOfferDisplay();

  const isOpened = useRef(false);

  useEffect(() => {
    if (profile && !isOpened.current) {
      console.log("showing modals");
      handleFeaturesDisplay({
        onClose: () => {
          if (profile?.type === 4) {
            handleOfferDisplay();
          }
        },
      });
      isOpened.current = true;
    }
  }, [handleFeaturesDisplay, handleOfferDisplay, modal, profile]);

  return null;
}

export default UserModalsWrapper;
