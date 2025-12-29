import { NewFeaturesModal } from "@/components/modals/NewFeaturesModal";
import { useModal } from "@/context/ModalProvider";
import { getPublicData } from "@/helpers/client-fetch";

function useHandleFeaturesDisplay() {
  const modal = useModal();

  const handleFeaturesDisplay = async ({
    onClose,
  }: {
    onClose?: () => void;
  }) => {
    try {
      const features = await getPublicData({
        queryKey: ["settings/newFeatures"],
      });

      console.log(features);

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
          onClose && onClose();
        }
      } else {
        onClose && onClose();
      }
    } catch (e) {
      console.log("features error : ", e);
    }
  };

  return { handleFeaturesDisplay };
}

export default useHandleFeaturesDisplay;
