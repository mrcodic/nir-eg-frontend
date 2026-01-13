import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OTP_SEND_TIME_KEY } from "@/constants";
import { mutateClient } from "@/helpers/post-client";
import { useToast } from "@/hooks/use-toast";
import { isOtpExpired, setNewOtpSendTime } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";

export function Verify({ open, setOpen }) {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-6 sm:max-w-[450px]">
        <DialogHeader className="text-center">
          {/* 🔥 Warning Image/Icon */}
          <div className="mb-4 flex justify-center">
            <Image
              src="/assets/notfError.svg"
              alt="Warning"
              width={60}
              height={60}
              className="rounded-lg"
            />
          </div>

          {/* 🚨 Warning Title */}
          <DialogTitle className="text-center text-xl font-semibold text-red-600"></DialogTitle>
          <DialogDescription className="text-xl text-black">
            محتاج تعمل تأكيد لرقم الموبايل من خلال ال otp{" "}
          </DialogDescription>
        </DialogHeader>

        {/* ❗ Warning Alert Section */}

        {/* ✅ Dialog Buttons */}
        <DialogFooter className="mt-5 flex justify-between gap-5">
          <DialogClose asChild>
            <Link href="/resetPassword" className="w-full text-center">
              <Button
                className="bg-primary-800 h-full w-[150px]"
                onClick={async () => {
                  const phone = localStorage.getItem("phone");
                  const otp = await mutateClient("/otp/request", {
                    body: { phone },
                  });

                  if (otp) {
                    const { otpSendTime, isExpired } = isOtpExpired();

                    // new otp timestamp
                    if (isExpired) {
                      setNewOtpSendTime();

                      toast({
                        description: " بعتنالك otp عبر sms  ",
                        icon: "success",
                      });
                    } else {
                      // old otp timestamp
                      localStorage.setItem(
                        OTP_SEND_TIME_KEY,
                        otpSendTime.getTime().toString(),
                      );
                    }

                    router.push("/resetPassword?type=forget");
                  }
                }}
              >
                {" "}
                تأكيد{" "}
              </Button>
            </Link>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
