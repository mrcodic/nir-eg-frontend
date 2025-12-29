import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { telegramLiks } from "@/constants";
import { getClientPrivateData } from "@/helpers/client-fetch";
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
    queryFn: getClientPrivateData,
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
      <DialogContent className="max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <DotLottieReact
          className="mx-auto"
          src="/Animations/Success.lottie"
          autoplay
          loop
        />
        <h2 className="mb-4 text-center text-2xl font-semibold text-green-600">
          تم عملية الدفع بنجاح
        </h2>
        {data?.body?.type == 4 && (
          <div className="flex gap-2 rounded-lg border border-[#F8DEC5] p-2">
            <Image
              width={32}
              height={32}
              src="/assets/tele1.svg"
              alt="tele"
              className="h-[32px] w-[32px]"
            />
            <p className="text-center text-[16px] font-bold md:text-[20px]">
              انضم الآن لجروب الدعم العلمي على تليجرام
            </p>
          </div>
        )}

        <DialogFooter className="mt-5 flex w-full items-center justify-center">
          <DialogClose
            asChild
            className="flex w-full items-center justify-center!"
          >
            <Button
              type="submit"
              className="text-gray-25 bg-primary-800 hover:bg-primary-800 mx-auto w-[200px] rounded-2xl border-2 py-6! text-center font-bold text-white"
            >
              تأكيد
            </Button>
          </DialogClose>
          {data?.body?.type == 4 && (
            <Link
              href={tgHref}
              className="text-gray-25 bg-gray-light relative z-100000 mx-auto flex w-[200px] items-center justify-center rounded-2xl border-2 py-3! text-center font-bold text-white"
            >
              <Image
                width={32}
                height={32}
                src="/assets/tele1.svg"
                alt="tele"
                className="h-[24px] w-[24px]"
              />
              <span>الدعم العلمي</span>
            </Link>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
