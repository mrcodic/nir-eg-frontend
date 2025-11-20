"use client";

import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import CustomLoader from "@/components/custom/Loader";
import { Form } from "@/components/ui/form";
import { OTP_SEND_TIME_KEY } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/layouts/AuthLayout";
import { forgetPasswordSchema } from "@/lib/schemas";
import {
  getUserPhoneFromStorage,
  isOtpExpired,
  presistUserPhone,
  setNewOtpSendTime,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
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
    <AuthLayout img={"/assets/forgetpassword5.png"}>
      <div className="">
        <div className="flex gap-2">
          <Image
            src="/assets/LockColor.svg"
            className="w-[32px] h-[32px]"
            width={32}
            height={32}
            alt="lock"
          />

          <div>
            <h3 className="text-[#121212] text-[20px] font-bold">
              نسيت كلمة السر
            </h3>
            <p className="text-[16px] font-medium mt-[4px] text-gray-dark">
              أدخل رقم الهاتف المسجل لدينا لتتمكن من إعادة تعيين كلمة سر جديدة
            </p>
          </div>
        </div>
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
            <GoogleReCaptcha
              onVerify={(token) => {
                // setToken(token);
                form.setValue("recaptcha_token", token);
              }}
            />
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
    </AuthLayout>
  );
};
export default ForgetPasswordPage;
