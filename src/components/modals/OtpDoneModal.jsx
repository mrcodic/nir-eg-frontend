import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

import { getLocalStorage } from "@/utils/clientFun";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { Check, LogOut, Phone } from "lucide-react";
import Link from "next/link";
import ReactConfetti from "react-confetti";

export default function PaySuccess({ open, setOpen }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-8 max-w-lg bg-white rounded-lg shadow-lg">
        <DotLottieReact
          className=" mx-auto"
          src="/Animations/Success.lottie"
          autoplay
          loop
        />
        <h2 className="text-2xl font-semibold text-black/80 text-center mb-4">
          الحسابات اللي كانت بتستنى كود OTP للتفعيل على الواتساب، اتفعّلت بنجاح
          ودلوقتي التسجيل بقى من غير كود OTP.{" "}
        </h2>

        <DialogFooter className="flex gap-8 justify-center items-center  w-full mt-5">
          <DialogClose asChild className="flex items-center justify-center! ">
            <Link href={`/register`} className="flex">
              <Button
                type="submit"
                className="text-gray-25 border-2 bg-[#523412] text-white  w-[200px] "
              >
                إنشاء حساب الان
              </Button>
            </Link>
          </DialogClose>
          <DialogClose asChild className="flex items-center justify-center! ">
            <Button
              type="submit"
              className="text-gray-25 border-2 bg-white hover:bg-gray-100 w-[200px] mx-auto"
            >
              الغاء
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
