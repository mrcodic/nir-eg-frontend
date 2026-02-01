import OfferModel from "@/components/modals/OfferModel";
import { useModal } from "@/context/ModalProvider";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useCallback } from "react";
import useCoupon from "./useCoupon";

function useHandleOfferDisplay() {
  const modal = useModal();
  const { showCoupon, isLoading, data } = useCoupon();

  const handleOfferDisplay = useCallback(async () => {
    if (!isLoading && showCoupon) {
      modal.setDialogContent(<OfferModel />);
      modal.addSideElement(
        <DotLottieReact
          className="fixed inset-0 z-60 mx-auto w-full"
          src="/Animations/Celeberation.json"
          autoplay
        />,
      );
      modal.openModal();
    }
  }, [modal, isLoading, showCoupon]);

  return { handleOfferDisplay };
}

export default useHandleOfferDisplay;
