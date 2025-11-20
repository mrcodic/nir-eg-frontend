"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { OTP_SEND_TIME_KEY } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import useOtp from "@/hooks/useOtp";
import { otpSchema } from "@/lib/schemas";
import { getLocalStorage } from "@/utils/clientFun";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import CustomLoader from "../custom/Loader";
import OTPInput from "../custom/OTPInput";
import CountDownTimerUI from "./CountDownTimerUI";

const ValidateOtp = ({ setResetForm }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { toast } = useToast();

  const type = searchParams.get("type");

  const form = useForm({
    mode: "all",
    resolver: zodResolver(otpSchema),

    defaultValues: {
      phone: getLocalStorage("phone"),
      otp_code: "",
    },
  });

  const { sendOtp, start, minutes, seconds, resending, setStart } = useOtp();

  const onSubmit = async (v) => {
    try {
      await axios.post("/api?url=otp/verify", v);
      toast({
        description: "تم تأكيد ررقم الهاتف بنجاح",
        icon: "success",
      });
      setStart(true);
      if (type == "forget") {
        setResetForm(true);
      } else {
        router.push("/login");
      }

      localStorage.removeItem(OTP_SEND_TIME_KEY);
    } catch (e) {
      toast({
        status: e.status,
        description: " رمز التأكيد غلط او وقته خلص",
        icon: "error",
      });
    }
    // const response = await axios.post(
    //   "https://more-english.net/api/v1/auth/register",
    //   v
    // );
  };

  return (
    <div className="">
      <div className="flex gap-2">
        <img
          src={type == "forget" ? "/assets/LockColor.svg" : "/assets/Done.svg"}
          className="w-[32px] h-[32px]"
        />
        <div>
          <h3 className="text-[#121212] text-[20px] font-bold">
            {type == "forget"
              ? "إعادة تعيين كلمة السر"
              : " تأكيد رقم هاتف الطالب"}
          </h3>
          <div>
            <p className="text-[16px] font-medium mt-[4px] text-gray-dark">
              قمنا بإرسال رمز التأكيد إلى رقم الهاتف التالي
            </p>
            <span className="text-[#121212] font-bold inline-block  " dir="ltr">
              {getLocalStorage("phone")}
            </span>
            {/* <span className="text-[16px] font-medium mt-[8px] text-gray-dark">
              عبر تطبيق واتساب
            </span> */}
          </div>
        </div>
      </div>
      <div className="h-px w-full mt-[16px] bg-primary-700" />
      <div className="h-px w-full mt-[2px] bg-[#523412]" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-[40px] w-full"
        >
          {start && <CountDownTimerUI minutes={minutes} seconds={seconds} />}

          <button
            type="button"
            onClick={async () => {
              await sendOtp(getLocalStorage("phone"));
            }}
            className="text-[#523412] cursor-pointer text-[18px]  underline mt-[16px] font-bold disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 items-center"
            disabled={start}
          >
            أعد الإرسال {resending && <CustomLoader />}
          </button>
          <div className="mt-[58px] flex justify-end text-32! " dir="ltr">
            <FormField
              control={form.control}
              name="otp_code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <OTPInput length={6} form={form} name="otp_code" />

                    {/* <InputOTP maxLength={6} {...field} disabled={!start}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP> */}
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {type === "forget" ? (
            <div className="mt-[56px] flex gap-2">
              <span className="text-sm font-medium inline-block">
                ليس لديك حساب؟
              </span>
              <Link
                href={"/register"}
                className="  text-sm font-bold text-[#523412] underline"
              >
                إنشاء حساب
              </Link>
            </div>
          ) : (
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
          )}
          {/* <GoogleReCaptcha
            onVerify={(token) => {
              // setToken(token);
              form.setValue("recaptcha_token", token);
            }}
          /> */}
          <button
            type="submit"
            className="bg-[#523412] text-white rounded-[10px] py-2 font-bold w-[265px] flex justify-center mt-[56px] border border-primary-700"
            disabled={form.formState.isSubmitting}
          >
            {!form.formState.isSubmitting ? "   تأكيد" : <CustomLoader />}
          </button>
        </form>
      </Form>
    </div>
  );
};
export default ValidateOtp;
