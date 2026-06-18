import { useModal } from "@/context/ModalProvider";
import dynamic from "next/dynamic";
import { useCallback } from "react";

const OfferModel = dynamic(() => import("@/components/modals/OfferModel"));
const DotLottieReact = dynamic(
  async () => (await import("@lottiefiles/dotlottie-react")).DotLottieReact,
);

function useHandleOfferDisplay() {
  const modal = useModal();

  const handleOfferDisplay = useCallback(async () => {
    modal.setDialogContent(<OfferModel />);
    modal.addSideElement(
      <DotLottieReact
        className="fixed inset-0 z-60 mx-auto w-full"
        src="/Animations/Celeberation.json"
        autoplay
      />,
    );
    modal.openModal();
  }, [modal]);

  return { handleOfferDisplay };
}

export default useHandleOfferDisplay;
