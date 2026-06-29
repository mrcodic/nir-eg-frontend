import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";

type OTPNotVerifIedProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function OTPNotVerifIed({ open, setOpen }: OTPNotVerifIedProps) {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-6 sm:max-w-[450px]">
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
          <DialogDescription className="text-xl text-black">
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
                  setOpen(false);
                  return;
                }

                router.push("/verify-otp?type=login");
              }}
            >
              إرسال رمز التأكد
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
