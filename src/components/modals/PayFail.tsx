import Image from "next/image";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";

export default function PayFail({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className=" ">
      <div className="flex flex-col items-center">
        <Image
          src="/assets/gifs/fail.gif"
          width={56}
          height={56}
          alt="fail"
          className="size-14 object-contain"
        />

        <div className="flex flex-col items-center text-center">
          <p className="mb-2 text-lg font-bold text-black">
            {title || "حدث خطأ ما أثناء عملية الدفع"}
          </p>
          {description && (
            <p className="text-base font-bold text-black">{description}</p>
          )}

          <DialogClose asChild>
            <Button className="mt-6">اغلاق</Button>
          </DialogClose>
        </div>
      </div>
    </div>
  );
}

// <DialogFooter className="flex justify-center items-center  w-full mt-5">
// <DialogClose
//   asChild
//   className="flex items-center justify-center! w-full"
// >
//   <Button
//     type="button"
//     className="text-gray-25 border-2 bg-white hover:bg-gray-100 w-[200px] mx-auto text-black"
//   >
//     تأكيد
//   </Button>
// </DialogClose>
// </DialogFooter>
