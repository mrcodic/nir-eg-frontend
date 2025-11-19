import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getLocalStorage } from "@/utils/clientFun";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { Check, LogOut, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactConfetti from "react-confetti";

export default function PayFail({
  open,
  setOpen,
  score,
  showAnswers,
  start,
  retake,
}) {
  const { SingleCourse, room } = useParams();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-8 flex justify-center items-center  bg-white rounded-lg shadow-lg">
          <div className=" ">
            <div className="">
              <DotLottieReact
                className="w-[112px] h-[112px] mx-auto"
                src="/Animations/Fail.json"
                autoplay
                loop
              />
              {/* <DotLottieReact
                  className="w-[112px] h-[112px] mx-auto"
                  src="/Animations/fail.json"
                  autoplay
                  loop
                /> */}

              <div className="mb-[12px]">
                <div className="flex gap-[12px] mt-[32px]">
                  <img src="/assets/Close2.svg" />
                  <span className="text-[#121212] inline-block text-[18px] font-bold">
                    حصل مشكلة في عملية الدفع
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
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
