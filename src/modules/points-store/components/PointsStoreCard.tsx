"use client";

import LoaderLottie from "@/components/shared/LoaderLottie";
import { useModal } from "@/context/ModalProvider";
import { useToast } from "@/hooks/use-toast";
import BuyPointsItemModal from "@/modules/points-store/components/BuyPointsItemModal";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../../../components/ui/button";

const PointsStoreCard = ({ storeItem }) => {
  const router = useRouter();
  const modal = useModal();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);

  // async function addToFavourite(storeItem_id) {
  //   if (storeItem.favorite) {
  //     modal.setDialogContent(<RemoveFav gift={storeItem} />);
  //     modal.openModal();
  //     return;
  //   }

  //   const api = "/api?url=students/store/items/add_to_favorite";
  //   setLoadingFav(true);
  //   try {
  //     const response = await axios.post(api, { storeItem_id });
  //     if (response.status === 200) {
  //       toast({
  //         description: "تم اضافة الهدية إلى المفضلة بنجاح",
  //         icon: "success",
  //       });

  //       router.refresh();
  //     }
  //   } catch (e) {
  //     toast({
  //       description: e.response.data?.error.message,
  //       icon: "error",
  //     });
  //   } finally {
  //     setLoadingFav(false);
  //   }
  // }

  // async function buystoreItem(storeItem_id) {
  //   if (!storeItem.acquire) {
  //     modal.setDialogContent(<BuystoreItem gift={storeItem} />);
  //     modal.openModal();
  //     return;
  //   }
  // }

  return (
    <div className="relative flex w-full flex-col rounded-lg">
      <div className="bg-background relative flex h-[232px] w-full items-center justify-center rounded-lg">
        <Image
          src={storeItem?.image || "/assets/playStation.svg"}
          fill
          alt=""
          className="object-contain"
        />
      </div>

      <div className={`relative mt-4 w-full rounded-lg border bg-white p-2`}>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <h3 className="text-lg font-bold">{storeItem.name || "PS5"}</h3>
          </div>

          <div className="flex items-center gap-1">
            <Image
              src="/assets/star-colored.svg"
              width={24}
              height={24}
              alt="star icon"
            />

            <span className="inline-block text-lg font-bold">
              {storeItem?.price}
            </span>
            <span className="text-sm">نقطة</span>
          </div>

          <hr className="" />

          <div className="mt-4 flex justify-between gap-x-6 gap-y-2 max-lg:flex-wrap">
            <Button
              className="w-full grow"
              onClick={() => {
                modal.setDialogContent(
                  <BuyPointsItemModal storeItem={storeItem} />,
                );
                modal.openModal();
              }}
            >
              شراء
            </Button>

            <Button className="group w-full grow" variant="outline">
              {loadingFav ? (
                <LoaderLottie className="size-6" />
              ) : (
                <Heart className="size-6 group-hover:fill-white" />
              )}

              {storeItem.favorite ? " إزالة من المفضلة " : " أضف إالى المفصلة"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PointsStoreCard;
