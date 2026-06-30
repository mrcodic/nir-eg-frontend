import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { Coupon } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useCallback } from "react";

const OfferModel = dynamic(() => import("@/components/modals/OfferModel"));
const DotLottieReact = dynamic(
  async () => (await import("@lottiefiles/dotlottie-react")).DotLottieReact,
);

function useHandleOfferDisplay() {
  const modal = useModal();
  const queryClient = useQueryClient();
  const { profile } = useAuthContext();

  const handleOfferDisplay = useCallback(async () => {
    const couponData = await getClientPrivateData<{ data: Coupon }>({
      queryKey: ["/students/profile/promo_code"],
    });

    if (
      !profile ||
      profile?.type !== 4 ||
      !couponData ||
      !couponData?.data?.show_promo
    )
      return;

    queryClient.setQueryData(["/students/profile/promo_code"], couponData);

    modal.setDialogContent(<OfferModel />);
    modal.setDialogContentProps({
      className: "max-w-[450px] rounded-lg",
    });
    modal.addSideElement(
      <DotLottieReact
        className="fixed inset-0 z-60 mx-auto w-full"
        src="/Animations/Celeberation.json"
        autoplay
      />,
    );
    modal.openModal();
  }, [modal, profile, queryClient]);

  return { handleOfferDisplay };
}

export default useHandleOfferDisplay;
