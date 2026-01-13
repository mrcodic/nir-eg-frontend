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
import { useMounted } from "@/hooks/useMounted";
import useOtp from "@/hooks/useOtp";
import AuthHeader from "@/layouts/AuthHeader";
import { otpSchema } from "@/lib/schemas";
import { getLocalStorage } from "@/utils/clientFun";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomLoader from "../custom/Loader";
import OTPInput from "../custom/OTPInput";
import { Button } from "../ui/button";
import CountDownTimerUI from "../ui/CountDownTimerUI";

const ValidateOtp = ({ setResetForm }) => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [savedPhone, setSavedPhone] = useState(() => getLocalStorage("phone"));
  const isMounted = useMounted();

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

  useEffect(() => {
    if (typeof window === "undefined" || savedPhone) return;
    const storagePhone = getLocalStorage("phone");
    if (storagePhone) {
      setSavedPhone(storagePhone);
    } else {
      router.push("/forgetPassword");
    }
  }, [router, savedPhone]);

  return (
    <div className="">
      <AuthHeader
        title="تأكيد رقم الهاتف"
        description={
          <span>
            {start ? "قمنا" : "سنقوم"} بإرسال رمز التأكيد إلى رقم الهاتف التالي{" "}
            <span
              dir="ltr"
              className="text-primary-800 font-bold underline"
              suppressHydrationWarning
            >
              {savedPhone}
            </span>
          </span>
        }
      />

      <div className="bg-gray-light mt-4 h-px w-full" />
      <div className="mt-0.5 h-px w-full bg-[#523412]" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 w-full">
          {start && isMounted ? (
            <CountDownTimerUI minutes={minutes} seconds={seconds} />
          ) : (
            <div>
              <p suppressHydrationWarning>
                قم بإرسال رمز التأكيد إلى رقم الهاتف التالي {savedPhone}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={async () => {
              await sendOtp(savedPhone);
            }}
            className="text-primary-800 mx-auto mt-4 flex cursor-pointer items-center gap-2 text-[18px] font-bold underline disabled:cursor-not-allowed disabled:opacity-50"
            disabled={start}
          >
            أعد الإرسال {resending && <Loader2 className="animate-spin" />}
          </button>

          <div className="mt-[58px] flex justify-center" dir="ltr">
            <FormField
              control={form.control}
              name="otp_code"
              render={() => (
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
              <span className="text-gray-dark inline-block font-medium">
                ليس لديك حساب؟
              </span>
              <Link
                href={"/register"}
                className="text-primary-800 border-gray-light rounded-md border px-4 text-sm font-bold underline"
              >
                إنشاء حساب
              </Link>
            </div>
          ) : (
            <div className="mt-14 flex gap-2">
              <span className="text-gray-dark inline-block font-medium">
                لديك حساب بالفعل؟
              </span>
              <Link
                href={"/login"}
                className="text-primary-800 border-gray-light rounded-md border px-4 text-sm font-bold underline"
              >
                تسجيل الدخول
              </Link>
            </div>
          )}

          <div className="mt-8 flex">
            <Button
              type="submit"
              className="ms-auto w-full max-w-40"
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
