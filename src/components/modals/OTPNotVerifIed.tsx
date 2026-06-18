import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { useToast } from "@/hooks/use-toast";
import { presistUserPhone } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";

export function OTPNotVerifIed({
  defaultPhone,
  showLogout,
}: {
  defaultPhone?: { phone: string; country: string };
  showLogout?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const modal = useModal();
  const { profile, logout } = useAuthContext();

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
          محتاج تعمل تأكيد لرقم الموبايل من خلال ال OTP
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="flex items-center gap-5">
        <DialogClose asChild>
          <Button
            className="h-full w-full"
            onClick={async () => {
              const phone = localStorage.getItem("phone");
              if (!phone && !defaultPhone) {
                toast({
                  description: "الرقم مش موجود , دخل الرقم تانى",
                  icon: "error",
                });
                modal.closeModal();
                return;
              } else if (defaultPhone) {
                presistUserPhone(defaultPhone.phone, defaultPhone.country);
              } else {
                return;
              }

              router.push("/verify-otp?type=login");
            }}
          >
            إرسال رمز التأكد
          </Button>
        </DialogClose>
        {!!profile && showLogout && (
          <DialogClose asChild>
            <Button
              variant="destructive"
              className="h-full w-full"
              onClick={async () => {
                logout();
                window.location.href = "/login";
              }}
            >
              تسجيل الخروج
            </Button>
          </DialogClose>
        )}
      </DialogFooter>
    </>
  );
}
