"use client";

import { StudentSelectCenterModal } from "@/components/modals/StudentSelectCenterModal";
import { useModal } from "@/context/ModalProvider";
import { IUser } from "@/types";
import { useEffect, useRef } from "react";

export default function CenterSelectModalTrigger({
  profile,
}: {
  profile: IUser | null;
}) {
  const modal = useModal();
  const centerModalShown = useRef(false);

  useEffect(() => {
    if (centerModalShown.current) return;
    if (profile?.type === 3 && !profile?.has_center) {
      modal.setDialogContent(<StudentSelectCenterModal />);
      modal.openModal();
      centerModalShown.current = true;
    }
  }, [profile, modal]);

  return null;
}
