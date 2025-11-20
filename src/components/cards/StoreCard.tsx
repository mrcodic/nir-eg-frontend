"use client";
import LoaderLottie from "@/components/Loader";
import { Congrats } from "@/components/modals/Congrats";
import { useModal } from "@/context/ModalProvider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import BuyGift from "@/modules/store/BuyGift.modal";
import RemoveFav from "@/modules/store/RemoveFav.modal";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const StoreCard = ({ gift }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const router = useRouter();

  const modal = useModal();

  const { toast } = useToast();
  // const [optimisticMessages, addOptimisticMessage] = useOptimistic(
  //   messages,
  //   (state, newMessage) => [
  //     ...state,
  //     {
  //       text: newMessage,
  //       sending: true
  //     }
  //   ]
  // );
  async function addToFavourite(gift_id) {
    if (gift.favorite) {
      modal.setDialogContent(<RemoveFav gift={gift} />);
      modal.openModal();
      return;
    }

    const api = "/api?url=students/store/items/add_to_favorite";
    setLoadingFav(true);
    try {
      const response = await axios.post(api, { gift_id });
      if (response.status === 200) {
        toast({
          description: "تم اضافة الهدية إلى المفضلة بنجاح",
          icon: "success",
        });

        router.refresh();
      }
    } catch (e) {
      toast({
        description: e.response.data?.error.message,
        icon: "error",
      });
    } finally {
      setLoadingFav(false);
    }
  }
  async function buyGift(gift_id) {
    if (!gift.acquire) {
      modal.setDialogContent(<BuyGift gift={gift} />);
      modal.openModal();
      return;
    }
  }

  return (
    <div className=" flex relative w-full max-w-[346.667px] flex-col items-center rounded-lg h-[520px] ">
      <div className="h-[200px] items-center bg-background flex justify-center w-full rounded-lg ">
        <Image
          src={gift?.image || "/assets/playStation.svg"}
          width={118}
          height={160}
          alt=""
        />
      </div>
      <div
        className={`relative p-4 -top-2  rounded-lg bg-white w-[95%]    border  ${
          gift.price ? "border-[#1EAD7B]" : "border-primary-700"
        }`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <h3 className="text-[#121212] font-bold text-[24px]">
              {gift.name || "PS5"}
            </h3>
          </div>

          <span className="text-gray-dark font-medium text-[16px] inline-block">
            {gift.price} نقطة
          </span>

          <div className="mt-[16px] justify-between flex">
            <button
              className={cn(
                " p-px text-xs font-bold h-7  text-[12px] text-center w-[120px] flex items-center justify-center   border-2 border-primary-700  rounded-lg text-white"
              )}
              onClick={() => buyGift(gift.id)}
            >
              <div className="bg-primary w-full h-full rounded-lg place-items-center place-content-center ">
                {!loading ? (
                  gift.acquired ? (
                    "تم الشراء مسبقا"
                  ) : (
                    "شراء"
                  )
                ) : (
                  <LoaderLottie />
                )}{" "}
              </div>
            </button>

            <button
              onClick={() => addToFavourite(gift.id)}
              // href={`bundles/${courseDetails.id}`}
              className={cn(
                "border-primary text-xs  font-bold p-px   text-white text-nowrap w-[140px] h-7  text-[12px]   text-center flex items-center justify-center  border-2   rounded-lg "
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center gap-2 bg-primary-700 w-full h-full rounded-lg  ",
                  !gift.favorite && " bg-white text-blue-950 "
                )}
              >
                <Image
                  src={"/assets/heart.svg"}
                  alt=""
                  height={24}
                  width={24}
                />
                {!loadingFav ? (
                  gift.favorite ? (
                    " إزالة من المفضلة "
                  ) : (
                    " أضف إالى المفصلة"
                  )
                ) : (
                  <LoaderLottie />
                )}{" "}
              </div>
            </button>
          </div>
        </div>
      </div>

      <Congrats open={open} setOpen={setOpen} />
    </div>
  );
};
export default StoreCard;
