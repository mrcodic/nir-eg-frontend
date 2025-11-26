"use client";

import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import useHandleFeaturesDisplay from "@/hooks/useHandleFeaturesDisplay";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useRef } from "react";
import OfferModel from "./modals/OfferModel";

function UserModalsWrapper() {
  const modal = useModal();
  const { profile } = useAuthContext();
  const { handleFeaturesDisplay } = useHandleFeaturesDisplay();

  const isOpened = useRef(false);

  useEffect(() => {
    if (profile) {
      console.log("showing modals");
      handleFeaturesDisplay({
        onClose: () => {
          if (profile?.type === 4 && !isOpened.current) {
            modal.setDialogContent(<OfferModel />);
            modal.addSideElement(
              <DotLottieReact
                className="w-full z-60  mx-auto fixed inset-0   "
                src="/Animations/Celeberation.json"
                autoplay
              />
            );
            modal.openModal();
            isOpened.current = true;
          }
        },
      });
    }
  }, [profile]);

  return null;
}

export default UserModalsWrapper;
