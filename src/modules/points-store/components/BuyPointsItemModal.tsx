import TopBanner from "@/components/banners/TopBanner";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { useModal } from "@/context/ModalProvider";
import Image from "next/image";

function BuyPointsItemModal({ storeItem }: { storeItem: any }) {
  const modal = useModal();
  return (
    <div className="max-md:p-4 ">
      <DialogHeader className="flex-row text-start sm:text-start items-center gap-2">
        <Image
          src="/assets/gift-fill.svg"
          width={24}
          height={24}
          alt="gift icon"
        />

        <h3 className="font-bold">هل أنت متأكد من أنك تريد شراء الهدية؟</h3>
      </DialogHeader>

      <TopBanner
        render={
          <p className="font-bold">النقاط الخاصة بك لا تكفي لشراء الهدية</p>
        }
        icon="/assets/warning-fill.svg"
        showClose={false}
        className="mt-8 bg-background"
      />

      <div className="border border-primary-800 p-2 mt-8 flex gap-6 items-center flex-wrap rounded-lg justify-center">
        <Image
          src={storeItem.image}
          alt=""
          width={128}
          height={128}
          className="object-contain size-32"
        />

        <div className="space-y-2">
          <h4 className="font-bold text-xl">{storeItem.name || "PS5"}</h4>
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
        </div>
      </div>

      <DialogFooter className="w-full mt-6 sm:justify-center gap-y-2">
        <Button
          className="w-full"
          onClick={() => {
            modal.closeModal();
          }}
        >
          شراء
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            modal.closeModal();
          }}
        >
          إلغاء
        </Button>
      </DialogFooter>
    </div>
  );
}

export default BuyPointsItemModal;
