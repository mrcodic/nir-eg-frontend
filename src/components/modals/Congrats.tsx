import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useAuthContext } from "@/context/auth-context";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { DialogClose } from "@radix-ui/react-dialog";
import Link from "next/link";
import ReactConfetti from "react-confetti";

export function Congrats({ open, setOpen }) {
  const { profile } = useAuthContext();

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
      <DialogContent className="max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <DotLottieReact
          className="mx-auto"
          src="/Animations/Success.lottie"
          autoplay
          loop
        />
        <h2 className="mb-4 text-center text-2xl font-semibold text-green-600">
          مبروك! تسجيلك تم بنجاح !
        </h2>
        <p className="mb-6 text-center text-lg text-gray-700">
          إنت دلوقتي معانا في المنصة، تقدر ترجع يوم 9-2-2025 وتشوف كل الفيديوهات
          وتحضر كل الحصص المباشرة.
        </p>

        <h2 className="mb-4 text-center text-xl font-semibold text-green-600">
          استعد لتجربة تعليمية مميزة! 🚀{" "}
        </h2>

        <DialogFooter className="mt-5 flex w-full items-center justify-center">
          <DialogClose
            asChild
            className="flex w-full items-center justify-center!"
          >
            <Link href={`/bundles?grade=${profile?.grade || 1}`}>
              <Button
                type="submit"
                className="text-gray-25 mx-auto w-[200px] border-2 bg-white hover:bg-gray-100"
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
