import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/context/ModalProvider";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";

export function OTPNotVerifIed() {
  const router = useRouter();
  const { toast } = useToast();
  const modal = useModal();

  return (
    <>
      <DialogHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Image
            src="/assets/bg/otp-illustration.png"
            alt="Warning"
            width={200}
            height={200}
            className="rounded-lg"
          />
        </div>

        <DialogTitle className="sr-only" />
        <DialogDescription className="text-center text-xl">
          محتاج تعمل تأكيد لرقم الموبايل من خلال ال otp
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="flex gap-5">
        <DialogClose asChild>
          <Button
            className="h-full w-full"
            onClick={async () => {
              const phone = localStorage.getItem("phone");
              if (!phone) {
                toast({
                  description: "الرقم مش موجود , دخل الرقم تانى",
                  icon: "error",
                });
                modal.closeModal();
                return;
              }

              router.push("/verify-otp?type=login");
            }}
          >
            إرسال رمز التأكد
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}
