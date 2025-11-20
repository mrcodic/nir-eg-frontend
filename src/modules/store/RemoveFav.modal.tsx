import LoaderLottie from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RemoveFav({ open, setOpen, length, gift }) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function removeGift() {
    const api = "/api?url=students/store/items/remove_from_favorite";
    setLoading(true);
    try {
      const response = await axios.post(api, { gift_id: gift.id });
      if (response.status === 200) {
        toast({
          description: "تم ازالة الهدية من المفضلة بنجاح",
          icon: "success",
        });
      }
      router.refresh();
    } catch (e) {
      toast({
        description: e.response.data?.error.message,
        icon: "error",
      });
    } finally {
      setOpen(false);
      setLoading(false);
    }
  }
  return (
    <Dialog open={open}>
      <DialogContent className="p-8 max-w-lg bg-white rounded-lg shadow-lg">
        <div className="max-w-[466px] bg-white p-6 rounded-lg">
          <p className="text-[18px] font-bold text-[#121212] text-nowrap flex items-center ">
            <Image
              src="/assets/heart.svg"
              width={24}
              height={24}
              className="inline-block ml-2"
            />
            هل أنت متأكد من أنك تريد إزالة {gift?.name} من المفضلة؟{" "}
          </p>
          <div className="h-px my-[12px] bg-primary-700" />
          <div className=" border border-primary-700 bg-background flex p-4 gap-6 h-[136px] rounded-lg  items-center w-[418px] ">
            <img
              src={"/assets/playStation.svg"}
              className="w-[77px] h-[104px]"
            />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{gift.name}</h2>
              <span className="text-gray-dark font-medium text-base inline-block">
                {gift.price} نقطة
              </span>{" "}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-start! gap-6 items-center  w-full mt-5">
          <DialogClose
            asChild
            className="flex items-center justify-center! w-full"
          >
            <Button
              className="bg-primary border text-white font-bold border-primary-700 h-[32px] w-[144px] rounded-lg"
              onClick={() => {
                removeGift();
              }}
            >
              {" "}
              {loading ? <LoaderLottie /> : "إزالة"}{" "}
            </Button>
          </DialogClose>
          <DialogClose
            asChild
            className="flex items-center justify-center! w-full"
          >
            <Button
              type="submit"
              className=" border bg-white text-black hover:text-white  font-bold  h-[32px] w-[144px] rounded-lg"
              onClick={() => {
                setOpen(false);
              }}
            >
              إلغاء
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
