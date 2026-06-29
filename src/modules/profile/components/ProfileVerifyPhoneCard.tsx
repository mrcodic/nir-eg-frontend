import OtpModal from "@/components/modals/OtpModal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/context/ModalProvider";
import Image from "next/image";

function ProfileVerifyPhoneCard({ phone }: { phone: string }) {
  const modal = useModal();

  return (
    <div className="bg-background border-secondary mb-2.5 flex items-center justify-between gap-6 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Image
          src={"/assets/warning-fill.svg"}
          width={24}
          height={24}
          alt="warning image"
        />

        <h4 className="text-lg font-bold">لم تقم بتأكيد رقم ولي الأمر بعد</h4>
      </div>

      <Button
        className="h-9"
        onClick={() => {
          modal.setDialogContent(<OtpModal phone={phone} />);
          modal.openModal();
        }}
      >
        تأكيد رقم ولي الأمر
      </Button>
    </div>
  );
}

export default ProfileVerifyPhoneCard;
