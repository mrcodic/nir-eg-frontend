import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { telegramLiks } from "@/constants";
import { getDataClient } from "@/utils/clientFun";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import ReactConfetti from "react-confetti";
function resolveGrade(raw: string | null | undefined) {
  const n = Number(raw);
  if (Number.isFinite(n) && n >= 1 && n <= 3) return String(n);
  return "1";
}
function resolveTelegramHref(grade: string) {
  const byIndex =
    Array.isArray(telegramLiks) && telegramLiks[Number(grade)]
      ? telegramLiks[Number(grade)]
      : undefined;
  const byKey =
    !Array.isArray(telegramLiks) && telegramLiks?.[grade]
      ? telegramLiks[grade]
      : undefined;

  return byIndex || byKey || "/"; // hard fallback so Link is never undefined
}
export function PaySuccess({
  open,
  setOpen,
  grade,
}: {
  open?: boolean;
  setOpen?: (v: boolean) => void;
  grade?: string | null;
}) {
  const safeGrade = resolveGrade(grade);
  const tgHref = resolveTelegramHref(safeGrade);
  const { data } = useQuery({
    queryFn: getDataClient,
    queryKey: ["/students/profile"],
  });
  console.log(data?.body?.type);
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
          تم عملية الدفع بنجاح
        </h2>
        {data?.body?.type == 4 && (
          <div className="flex border rounded-lg p-2 border-[#F8DEC5] gap-2 ">
            <Image
              width={32}
              height={32}
              src="/assets/tele1.svg"
              alt="tele"
              className="w-[32px] h-[32px]"
            />
            <p className="font-bold text-[16px] md:text-[20px] text-center">
              انضم الآن لجروب الدعم العلمي على تليجرام
            </p>
          </div>
        )}

        <DialogFooter className="flex justify-center items-center  w-full mt-5">
          <DialogClose
            asChild
            className="flex items-center justify-center! w-full"
          >
            <Button
              type="submit"
              className="text-gray-25 font-bold border-2  py-6!  rounded-2xl text-center text-white bg-[#012D5A] hover:bg-[#012D5A] w-[200px] mx-auto"
            >
              تأكيد
            </Button>
          </DialogClose>
          {data?.body?.type == 4 && (
            <Link
              href={tgHref}
              className="text-gray-25 text-center flex items-center justify-center py-3!   rounded-2xl relative z-100000 font-bold border-2 bg-gray-light text-white  w-[200px] mx-auto"
            >
              <Image
                width={32}
                height={32}
                src="/assets/tele1.svg"
                alt="tele"
                className="w-[24px] h-[24px]"
              />
              <span>الدعم العلمي</span>
            </Link>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
