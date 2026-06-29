import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useAuthContext } from "@/context/auth-context";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { DialogClose } from "@radix-ui/react-dialog";
import Link from "next/link";

export function PaySuccess({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  const { profile } = useAuthContext();

  return (
    <div className="text-center">
      <DotLottieReact
        className="mx-auto"
        src="/Animations/Success.lottie"
        autoplay
        loop
      />
      <h2 className="mb-2 text-center text-2xl font-semibold text-green-600">
        {title || "اكتملت عملية الدفع بنجاح."}
      </h2>
      {description && (
        <p className="mb-2 text-center text-xl font-semibold">{description}</p>
      )}

      <DialogFooter className="mt-5 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-center sm:space-x-0">
        <DialogClose asChild className="">
          <Button className="h-11 w-full max-w-[184px] rounded-xl text-base font-bold">
            اغلاق
          </Button>
        </DialogClose>

        {profile?.type == 4 && !!profile?.group_link && (
          <Link
            href={profile?.group_link}
            className="w-full max-w-[184px]"
            target="_blank"
          >
            <Button
              variant="secondary"
              className="h-11 w-full max-w-[184px] rounded-xl text-base font-bold"
            >
              انضم للجروب
            </Button>
          </Link>
        )}
      </DialogFooter>
    </div>
  );
}
