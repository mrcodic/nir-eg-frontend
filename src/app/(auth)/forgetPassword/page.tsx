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
import axios from "axios";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";

const ForgetPasswordPage = () => {
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

  const router = useRouter();
  const { toast } = useToast();

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
            otpSendTime.getTime().toString()
          );
        }

        router.push("/resetPassword?type=forget");

        // localStorage.setItem("phone", v.phone);
        presistUserPhone(v.phone.phone, v.phone.country);
      }
    } catch (err) {
      console.log(err);
      toast({
        status: err.status,
        description: "الرقم غلط او بعتنالك otp من قبل",
        icon: "error",
      });
    }
  };

  return (
    <div className="">
      <AuthHeader
        title="نسيت كلمة السر"
        description=" أدخل رقم الهاتف المسجل لدينا لتتمكن من إعادة تعيين كلمة سر جديدة"
      />

      <div className="h-px w-full mt-[16px] bg-primary-700" />
      <div className="h-px w-full mt-[2px] bg-[#523412]" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-[40px] w-full"
        >
          <CustomPhoneInput
            name="phone.phone"
            form={form}
            placeholder="رقم هاتف الطالب بالإنجليزية"
            iconSrc="/assets/Phone1.svg"
            countryFieldName="phone.country"
            countryISOFieldName="phone.country_iso"
          />

          {/* <CustomInput
              name="phone"
              control={form.control}
              placeholder="رقم هاتف الطالب"
              iconSrc="/assets/Phone1.svg"
            /> */}

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

          <GoogleReCaptcha
            onVerify={(token) => {
              // setToken(token);
              form.setValue("recaptcha_token", token);
            }}
          />
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
export default ForgetPasswordPage;
