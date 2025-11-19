import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

import { getLocalStorage } from "@/utils/clientFun";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { Check, LogOut, Phone } from "lucide-react";
import Link from "next/link";
import ReactConfetti from "react-confetti";

export function Congrats({ open, setOpen }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {open && (
        <ReactConfetti
          width={500}
          height={700}
          className="z-100000! w-full"
          // numberOfPieces={200} // Adjust density
          gravity={0.3} // Slow fall effect
          recycle={false} // Stops after pieces are gone
        />
      )}
      <DialogContent className="p-8 max-w-lg bg-white rounded-lg shadow-lg">
        <DotLottieReact
          className=" mx-auto"
          src="/Animations/Success.lottie"
          autoplay
          loop
        />
        <h2 className="text-2xl font-semibold text-green-600 text-center mb-4">
          مبروك! تسجيلك تم بنجاح !
        </h2>
        <p className="text-lg text-gray-700 text-center mb-6">
          إنت دلوقتي معانا في المنصة، تقدر ترجع يوم 9-2-2025 وتشوف كل الفيديوهات
          وتحضر كل الحصص المباشرة.
        </p>

        <h2 className="text-xl font-semibold text-green-600 text-center mb-4">
          استعد لتجربة تعليمية مميزة! 🚀{" "}
        </h2>

        <DialogFooter className="flex justify-center items-center  w-full mt-5">
          <DialogClose
            asChild
            className="flex items-center justify-center! w-full"
          >
            <Link href={`/bundles?grade=${getLocalStorage("grade")}`}>
              <Button
                type="submit"
                className="text-gray-25 border-2 bg-white hover:bg-gray-100 w-[200px] mx-auto"
              >
                تأكيد
              </Button>
            </Link>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
