import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function PayFail() {
  return (
    <div className=" ">
      <div className="">
        <DotLottieReact
          className="mx-auto h-[112px] w-[112px]"
          src="/Animations/Fail.json"
          autoplay
          loop
        />

        <div className="mb-[12px]">
          <div className="mt-[32px] flex gap-[12px]">
            <img src="/assets/Close2.svg" />
            <span className="inline-block text-[18px] font-bold text-[#121212]">
              حصل مشكلة في عملية الدفع
            </span>
          </div>
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
