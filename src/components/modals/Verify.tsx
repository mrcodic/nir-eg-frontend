import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COOLDOWN_DURATION, OTP_SEND_TIME_KEY } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { isOtpExpired, setNewOtpSendTime } from "@/lib/utils";
import { getOtp } from "@/utils/api";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { AlertTriangle, Check, Ellipsis, LogOut, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";

export function Verify({ open, setOpen }) {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[450px] p-6">
        <DialogHeader className="text-center">
          {/* 🔥 Warning Image/Icon */}
          <div className="flex justify-center mb-4">
            <Image
              src="/assets/notfError.svg"
              alt="Warning"
              width={60}
              height={60}
              className="rounded-lg"
            />
          </div>

          {/* 🚨 Warning Title */}
          <DialogTitle className="text-xl text-center font-semibold text-red-600"></DialogTitle>
          <DialogDescription className="text-black text-xl">
            محتاج تعمل تأكيد لرقم الموبايل من خلال ال otp{" "}
          </DialogDescription>
        </DialogHeader>

        {/* ❗ Warning Alert Section */}

        {/* ✅ Dialog Buttons */}
        <DialogFooter className="flex justify-between gap-5 mt-5">
          <DialogClose asChild>
            <Link href="/resetPassword" className="w-full text-center ">
              <Button
                className="w-[150px] h-full bg-[#012D5A]"
                onClick={async () => {
                  const phone = localStorage.getItem("phone");
                  const otp = await getOtp(phone);
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
                        otpSendTime.getTime().toString()
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
