import { toast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import { isOtpExpired, setNewOtpSendTime } from "./utils";

export const handleOtpError = (error: any) => {
  if (isAxiosError(error) && error?.response?.status === 404) {
    toast({
      description: "لا يوجد طالب او ولى امر مسجل بهذا الرقم",
      icon: "error",
    });
  } else if (isAxiosError(error) && error?.response?.status === 405) {
    const { isExpired } = isOtpExpired();
    const remainingSec =
      error?.response?.data?.error?.data?.cooldown_remaining_sec ||
      error?.response?.data?.data?.cooldown_remaining_sec;
    toast({
      description: `انتظر ${
        remainingSec ? remainingSec : 60
      } ثانية حتى تستطيع ارسال otp مرة اخري`,
      icon: "error",
    });

    if (isExpired) {
      setNewOtpSendTime({
        customDuration: remainingSec,
      });
    }
  } else if (isAxiosError(error) && error?.status === 406) {
    toast({
      description: "تم الوصول للحد الاقصى اليومى لارسال otp",
      icon: "error",
    });
  } else {
    toast({
      description: "الرقم غلط او بعتنالك otp من قبل",
      icon: "error",
    });
  }
};
