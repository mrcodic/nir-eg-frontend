"use client";

import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { useEffect, useRef } from "react";
import OfferModel from "./modals/OfferModel";

function OfferModelWrapper() {
  const modal = useModal();
  const { profile } = useAuthContext();
  const isOpened = useRef(false);

  useEffect(() => {
    if (profile && profile?.type === 4 && !isOpened.current) {
      modal.setDialogContent(<OfferModel />);
      modal.openModal();
      isOpened.current = true;
    }
  }, [profile]);

  return null;
}

export default OfferModelWrapper;
