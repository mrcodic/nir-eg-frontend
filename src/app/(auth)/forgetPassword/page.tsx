"use client";

import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import SmallSpinner from "@/components/custom/SmallSpinner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { mutateClient } from "@/helpers/post-client";
import { useToast } from "@/hooks/use-toast";
import AuthHeader from "@/layouts/AuthHeader";
import { handleOtpError } from "@/lib/handle-otp-error";
import { getOtpSendSuccessMessage } from "@/lib/otp-success";
import { resolveOtpExpiryTimestamp } from "@/lib/otp-timer";
import { forgetPasswordSchema } from "@/lib/schemas";
import { getUserPhoneFromStorage, presistUserPhone } from "@/lib/utils";
import { OtpSendResponse } from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
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

  const onSubmit = async (v: {
    phone: { country: string; country_iso: string; phone: string };
    recaptcha_token?: string;
  }) => {
    try {
      const { phone, recaptcha_token } = v;
      const response = await mutateClient<OtpSendResponse>("/forgot-password", {
        body: {
          ...phone,
          recaptcha_token,
        },
      });

      if (response.status) {
        resolveOtpExpiryTimestamp(response?.data ?? null);

        toast({
          description: getOtpSendSuccessMessage(response),
          icon: "success",
        });

        presistUserPhone(v.phone.phone, v.phone.country);
        router.push("/verify-otp?type=forget");
      }
    } catch (err) {
      const errorMessage = handleOtpError(err);
      form.setError("phone.phone", {
        message: errorMessage,
      });
    }
  };

  return (
    <div>
      <AuthHeader
        title="نسيت كلمة السر"
        description="أدخل رقم الهاتف المسجل لدينا لتتمكن من إعادة تعيين كلمة سر جديدة"
      />

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
              href="/register"
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
              {!form.formState.isSubmitting ? (
                "تأكيد"
              ) : (
                <SmallSpinner className="text-white" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgetPasswordPage;

