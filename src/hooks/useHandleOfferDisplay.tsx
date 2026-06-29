import { useModal } from "@/context/ModalProvider";
import { useCallback } from "react";
import useCoupon from "./useCoupon";
import dynamic from "next/dynamic";

const OfferModel = dynamic(() => import("@/components/modals/OfferModel"));
const DotLottieReact = dynamic(
  async () => (await import("@lottiefiles/dotlottie-react")).DotLottieReact,
);

function useHandleOfferDisplay() {
  const modal = useModal();
  const { showCoupon, isLoading } = useCoupon();

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
