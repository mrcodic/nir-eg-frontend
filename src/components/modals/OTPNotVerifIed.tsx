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
              src="/assets/notfError.svg"
              alt="Warning"
              width={60}
              height={60}
              className="rounded-lg"
            />
          </div>

          <DialogTitle className="text-center text-xl font-semibold text-red-600" />
          <DialogDescription className="text-xl text-black">
            محتاج تعمل تأكيد لرقم الموبايل من خلال ال otp
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5 flex justify-between gap-5">
          <DialogClose asChild>
            <Button
              className="bg-primary-800 h-full w-[150px]"
              onClick={async () => {
                const phone = localStorage.getItem("phone");
                if (!phone) {
                  toast({
                    description: "الرقم مش موجود ",
                    icon: "error",
                  });

                  return;
                }

                router.push("/verify-otp?type=login");
              }}
            >
              تأكيد
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
