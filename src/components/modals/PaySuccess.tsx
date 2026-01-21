import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { telegramLiks } from "@/constants";
import { useAuthContext } from "@/context/auth-context";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { DialogClose } from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";

function resolveTelegramHref(grade: string) {
  const byIndex =
    Array.isArray(telegramLiks) && telegramLiks[Number(grade)]
      ? telegramLiks[Number(grade)]
      : undefined;
  const byKey =
    !Array.isArray(telegramLiks) && telegramLiks?.[grade]
      ? telegramLiks[grade]
      : undefined;

  return byIndex || byKey || "/";
}

export function PaySuccess() {
  const { profile } = useAuthContext();
  const tgHref = resolveTelegramHref(String(profile?.grade));

  return (
    <div className="">
      <DotLottieReact
        className="mx-auto"
        src="/Animations/Success.lottie"
        autoplay
        loop
      />
      <h2 className="mb-4 text-center text-2xl font-semibold text-green-600">
        تم عملية الدفع بنجاح
      </h2>
      {profile?.type == 4 && (
        <div className="flex gap-2 rounded-lg border border-[#F8DEC5] p-2">
          <Image
            width={32}
            height={32}
            src="/assets/tele1.svg"
            alt="tele"
            className="size-8"
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
        {profile?.type == 4 && (
          <Link
            href={tgHref}
            className="text-gray-25 bg-gray-light relative z-100000 mx-auto flex w-[200px] items-center justify-center rounded-2xl border-2 py-3! text-center font-bold text-white"
          >
            <Image
              width={24}
              height={24}
              src="/assets/tele1.svg"
              alt="tele"
              className="size-6"
            />
            <span>الدعم العلمي</span>
          </Link>
        )}
      </DialogFooter>
    </div>
  );
}
