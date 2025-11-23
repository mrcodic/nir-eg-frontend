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
import AuthHeader from "@/layouts/AuthHeader";
import { otpSchema } from "@/lib/schemas";
import { getLocalStorage } from "@/utils/clientFun";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CustomLoader from "../custom/Loader";
import OTPInput from "../custom/OTPInput";
import { Button } from "../ui/button";
import CountDownTimerUI from "./CountDownTimerUI";

const ValidateOtp = ({ setResetForm }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [savedPhone] = useState(() => getLocalStorage("phone"));

  const { toast } = useToast();

  const type = searchParams.get("type");

  const form = useForm({
    mode: "all",
    resolver: zodResolver(otpSchema),

    defaultValues: {
      phone: savedPhone,
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
      <AuthHeader
        title="تأكيد رقم الهاتف"
        description={
          <span>
            سنقوم بإرسال رمز التأكيد إلى رقم الهاتف التالي{" "}
            <span
              dir="ltr"
              className="text-primary-800 underline font-bold"
              suppressHydrationWarning
            >
              {savedPhone}
            </span>
          </span>
        }
      />

      <div className="h-px w-full mt-[16px] bg-primary-700" />
      <div className="h-px w-full mt-[2px] bg-[#523412]" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-[40px] w-full"
        >
          <CountDownTimerUI minutes={minutes} seconds={seconds} />

          <button
            type="button"
            onClick={async () => {
              await sendOtp(savedPhone);
            }}
            className="text-primary-800 mx-auto cursor-pointer text-[18px]  underline mt-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 items-center"
            disabled={start}
          >
            أعد الإرسال {resending && <CustomLoader />}
          </button>

          <div className="mt-[58px] flex justify-center " dir="ltr">
            <FormField
              control={form.control}
              name="otp_code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <OTPInput length={6} form={form} name="otp_code" />
                  </FormControl>

                  <FormMessage className="text-end" />
                </FormItem>
              )}
            />
          </div>

          {type === "forget" ? (
            <div className="mt-6 flex items-center gap-2">
              <span className=" font-medium inline-block text-gray-dark">
                ليس لديك حساب؟
              </span>
              <Link
                href={"/register"}
                className="  text-sm font-bold text-primary-800 underline px-4 rounded-md border border-gray-light"
              >
                إنشاء حساب
              </Link>
            </div>
          ) : (
            <div className="mt-14 flex gap-2">
              <span className=" font-medium inline-block text-gray-dark">
                لديك حساب بالفعل؟
              </span>
              <Link
                href={"/login"}
                className="  text-sm font-bold text-primary-800 underline px-4 rounded-md border border-gray-light"
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
          <div className="flex mt-8">
            <Button
              type="submit"
              className="ms-auto max-w-40 w-full"
              disabled={form.formState.isSubmitting}
            >
              {!form.formState.isSubmitting ? "   تأكيد" : <CustomLoader />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default ValidateOtp;
