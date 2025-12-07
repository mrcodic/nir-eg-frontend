"use client";

import LoaderLottie from "@/components/Loader";
import { useModal } from "@/context/ModalProvider";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

const StoreCard = ({ storeItem }) => {
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
    <div className=" flex relative w-full  flex-col  rounded-lg ">
      <div className="h-[232px] items-center bg-background flex justify-center w-full rounded-lg relative ">
        <Image
          src={storeItem?.image || "/assets/playStation.svg"}
          fill
          alt=""
          className="object-contain"
        />
      </div>

      <div className={`relative p-2 border w-full  mt-4 rounded-lg bg-white `}>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <h3 className=" font-bold text-lg">{storeItem.name || "PS5"}</h3>
          </div>

          <div className="flex items-center gap-1">
            <Image
              src="/assets/star-colored.svg"
              width={24}
              height={24}
              alt="star icon"
            />

            <span className=" font-bold text-lg inline-block">
              {storeItem?.price}
            </span>
            <span className="text-sm">نقطة</span>
          </div>

          <hr className="" />

          <div className="mt-4 justify-between flex max-lg:flex-wrap gap-x-6 gap-y-2">
            <Button className="w-full grow ">شراء</Button>

            <Button className="w-full  grow group" variant="outline">
              {loadingFav ? (
                <LoaderLottie className="size-6 " />
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
export default StoreCard;
