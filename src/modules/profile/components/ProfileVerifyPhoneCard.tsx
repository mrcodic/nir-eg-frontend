import { Button } from "@/components/ui/button";
import Image from "next/image";

function ProfileVerifyPhoneCard() {
  return (
    <div className="bg-background border border-secondary rounded-lg p-4 flex justify-between gap-6 items-center mb-2.5">
      <div className="flex items-center gap-2">
        <Image
          src={"/assets/warning-fill.svg"}
          width={24}
          height={24}
          alt="warning image"
        />

        <h4 className="font-bold text-lg">لم تقم بتأكيد رقم ولي الأمر بعد</h4>
      </div>

      <Button className="h-9">تأكيد رقم ولي الأمر</Button>
    </div>
  );
}

export default ProfileVerifyPhoneCard;
