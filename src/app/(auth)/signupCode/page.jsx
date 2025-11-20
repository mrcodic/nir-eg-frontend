"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import AuthLayout from "@/layouts/AuthLayout";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { useTimer } from "react-timer-hook";
const signupCode = () => {
  const { handleSubmit, register } = useForm({ mode: "all" });
  const router = useRouter();
  const time = new Date();
  time.setSeconds(time.getSeconds() + 300);
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: time,
    onExpire: () => console.warn("onExpire called"),
  });
  const onSubmit = () => {
    router.push("/newPassword");
  };
  return (
    <AuthLayout img={"/assets/Signup.png"}>
      <div className="">
        <div className="flex gap-2">
          <img src="/assets/Done.svg" className="w-[32px] h-[32px]" />
          <div>
            <h3 className="text-[#121212] text-[20px] font-bold">
              تأكيد رقم هاتف الطالب
            </h3>
            <div>
              <p className="text-[16px] font-medium mt-[4px] text-gray-dark">
                قمنا بإرسال رمز التأكيد إلى رقم الهاتف التالي
              </p>
              <span className="text-[#121212] font-bold inline-block">
                0123******789
              </span>
              <span className="text-[16px] font-medium mt-[8px] text-gray-dark">
                عبر تطبيق واتساب
              </span>
            </div>
          </div>
        </div>
        <div className="h-px w-full mt-[16px] bg-primary-700" />
        <div className="h-px w-full mt-[2px] bg-[#523412]" />
        <form onSubmit={handleSubmit(onSubmit)} className="mt-[40px] w-full">
          <div className="flex mt-[32px] gap-[24px] w-full">
            <div className=" flex-1 flex gap-2  items-center text-gray-dark ">
              <span className="text-[#121212] font-bold inline-block text-[18px]">
                هذا الرمز صالح لمدة
              </span>
              <div className="text-[#B75050] font-bold text-[20px]">
                <span>{minutes}</span>:<span>{seconds}</span>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              const time = new Date();
              time.setSeconds(time.getSeconds() + 300);
              restart(time);
            }}
            className="text-[#523412] cursor-pointer text-[18px] inline-block underline mt-[16px] font-bold"
          >
            أعد الإرسال
          </div>
          <div className="mt-[58px]">
            <h3 className="text-[#121212] font-bold text-[18px]">
              أدخل رمز التأكيد
            </h3>
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="mt-[56px] flex gap-2">
            <span className="text-sm font-medium inline-block">
              لديك حساب بالفعل؟
            </span>
            <Link
              href={"/login"}
              className="  text-sm font-bold text-[#523412] underline"
            >
              تسجيل الدخول
            </Link>
          </div>
          <GoogleReCaptcha
            onVerify={(token) => {
              // setToken(token);
              form.setValue("recaptcha_token", token);
            }}
          />
          <button className="bg-[#523412] mt-[48px] text-white rounded-lg py-2 font-bold w-[269px]  border-2 border-primary-700">
            تأكيد
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};
export default signupCode;
