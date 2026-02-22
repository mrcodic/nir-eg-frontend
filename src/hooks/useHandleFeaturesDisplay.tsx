import { useModal } from "@/context/ModalProvider";
import { getClientData } from "@/helpers/client-fetch";
import dynamic from "next/dynamic";

const NewFeaturesModal = dynamic(
  () => import("@/components/modals/NewFeaturesModal"),
);

function useHandleFeaturesDisplay() {
  const modal = useModal();

  const handleFeaturesDisplay = async ({
    onClose,
  }: {
    onClose?: () => void;
  }) => {
    try {
      const features = await getClientData({
        queryKey: ["settings/newFeatures"],
      });

      // 1) check if feature enabled
      if (features?.data?.enabled === 1) {
        // 2) check if seen the features
        const savedFeatures = localStorage.getItem("more-features");
        const stringifiedFeatures = JSON.stringify(features?.data);

        if (!savedFeatures || savedFeatures !== stringifiedFeatures) {
          modal.setDialogContent(
            <NewFeaturesModal features={features?.data} />,
          );
          modal.openModal();
          localStorage.setItem("more-features", stringifiedFeatures);
        } else {
          onClose?.();
        }
      } else {
        onClose?.();
      }
    } catch (e) {
      console.log("features error : ", e);
      onClose?.();
    }
  };

  return { handleFeaturesDisplay };
}

export default useHandleFeaturesDisplay;
