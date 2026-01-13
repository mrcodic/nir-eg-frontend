"use client";

import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import CustomLoader from "@/components/custom/Loader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { OTP_SEND_TIME_KEY } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import AuthHeader from "@/layouts/AuthHeader";
import { forgetPasswordSchema } from "@/lib/schemas";
import {
  getUserPhoneFromStorage,
  isOtpExpired,
  presistUserPhone,
  setNewOtpSendTime,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";

const ForgetPasswordPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      phone: {
        country: getUserPhoneFromStorage().phone_code,
        country_iso: getUserPhoneFromStorage().phone_iso,
        phone: getUserPhoneFromStorage().phone,
      },
      recaptcha_token: "",
    },
  });

  const onSubmit = async (v) => {
    try {
      const { phone, recaptcha_token } = v;
      const response = await axios.post("/api?url=forgot-password", {
        ...phone,
        recaptcha_token,
      });

      if (response.status == 200) {
        console.log(response?.data);

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
            otpSendTime.getTime().toString(),
          );
        }

        router.push("/resetPassword?type=forget");

        // localStorage.setItem("phone", v.phone);
        presistUserPhone(v.phone.phone, v.phone.country);
      }
    } catch (err) {
      console.log(err);
      if (isAxiosError(err) && err?.response?.status === 404) {
        toast({
          description: "لا يوجد طالب او ولى امر مسجل بهذا الرقم",
          icon: "error",
        });
      } else {
        toast({
          description: "الرقم غلط او بعتنالك otp من قبل",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="">
      <AuthHeader
        title="نسيت كلمة السر"
        description=" أدخل رقم الهاتف المسجل لدينا لتتمكن من إعادة تعيين كلمة سر جديدة"
      />

      <div className="bg-gray-light mt-[16px] h-px w-full" />
      <div className="mt-[2px] h-px w-full bg-[#523412]" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-[40px] w-full"
        >
          <CustomPhoneInput
            name="phone.phone"
            form={form}
            placeholder="رقم هاتف الطالب بالإنجليزية"
            countryFieldName="phone.country"
            countryISOFieldName="phone.country_iso"
          />

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

          <GoogleReCaptcha
            onVerify={(token) => {
              form.setValue("recaptcha_token", token);
            }}
          />
          <div className="mt-8 flex">
            <Button
              type="submit"
              className="ms-auto w-full max-w-40"
              disabled={form.formState.isSubmitting}
            >
              {!form.formState.isSubmitting ? "تأكيد" : <CustomLoader />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default ForgetPasswordPage;
