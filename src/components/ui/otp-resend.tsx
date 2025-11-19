import { getOtp } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

function OtpResend() {
  const { toast } = useToast();
  return (
    <div
      onClick={async () => {
        const parentPhone = localStorage.getItem("phone");
        const res = await getOtp(parentPhone);

        if (res.status) {
          // setResend(false);
          toast({
            description: "بعتنالك otp تاني   ",
            icon: "success",
          });
        }
      }}
      className="text-[#523412] cursor-pointer text-[18px] inline-block underline mt-[16px] font-bold"
      // disabled={resend}
    >
      أعد الإرسال
    </div>
  );
}

export default OtpResend;
