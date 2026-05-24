"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import CustomInput from "@/components/custom/customInput";
import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import SmallSpinner from "@/components/custom/SmallSpinner";
import { OTPNotVerifIed } from "@/components/modals/OTPNotVerifIed";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAuthContext } from "@/context/auth-context";
import { openDesktopAuthDeeplink } from "@/helpers/auth-deeplink";
import { useToast } from "@/hooks/use-toast";
import AuthHeader from "@/layouts/AuthHeader";
import { loginSchema } from "@/lib/schemas";
import { getUserPhoneFromStorage, presistUserPhone } from "@/lib/utils";
import { loginWithPhonePassword } from "@/services/auth.service";
import { saveCookie } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { z } from "zod";

const AuthPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [verify, setVerify] = useState(false);
  const { setToken, profile } = useAuthContext();

  const searchParams = useSearchParams();
  const redirectSearch = searchParams.get("redirect");
  const redirectPath = redirectSearch
    ? decodeURIComponent(redirectSearch)
    : null;

  const form = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      phone: {
        country: getUserPhoneFromStorage().phone_code,
        country_iso: getUserPhoneFromStorage().phone_iso,
        phone: getUserPhoneFromStorage().phone,
      },
      password: "",
      recaptcha_token: "",
    },
  });

  useEffect(() => {
    if (profile) {
      router.replace("/");
    }
  }, [profile, router]);

  const onSubmit = async (v: z.infer<typeof loginSchema>) => {
    try {
      const { phone, ...rest } = v;
      const response = await loginWithPhonePassword({
        phone: phone.phone,
        country: phone.country,
        country_iso: phone.country_iso || "EG",
        password: rest.password,
        recaptcha_token: rest.recaptcha_token,
      });

      await saveCookie(response?.access_token);

      Cookies.remove("guest_token");
      queryClient.invalidateQueries({ queryKey: ["/students/profile"] });

      setToken(response?.access_token);

      presistUserPhone(phone.phone, phone.country);
      openDesktopAuthDeeplink(response);

      if (
        response?.student?.type === 3 &&
        response?.student?.has_center === true
      ) {
        router.push(redirectPath || `bundles/${response?.student?.center_id}`);
      } else if (response?.student.type === 4 || response?.student.type === 5) {
        router.push(
          redirectPath || `bundles?grade=${response?.student?.grade}`,
        );
      } else if (
        response?.student?.type === 3 &&
        response?.student?.has_center === false
      ) {
        router.push(redirectPath || `profile`);
      }
    } catch (err) {
      console.log("💥 login error : ", err);

      if (err.status == 409) {
        localStorage.setItem("phone", v?.phone?.phone);

        toast({
          icon: "error",
          description: "رقم الهاتف غير مفعل",
        });
        setVerify(true);
      } else {
        toast({
          description:
            err?.status !== 500
              ? err?.response?.error?.message || err?.response?.data?.message
              : "حدث خطأ ما اثناء تسجيل الدخول",
          icon: "error",
        });
      }
    }
  };

  if (profile) return <LoadingSpinner className="h-full min-h-[300px]" />;

  return (
    <div className="">
      <AuthHeader
        title="تسجيل الدخول"
        description=" أدخل رقم الهاتف المسجل لدينا و كلمة السر لتتمكن من الدخول لحسابك"
      />

      <div className="bg-gray-light mt-2 h-px w-full" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 w-full">
          <CustomPhoneInput
            name="phone.phone"
            form={form}
            label="رقم هاتف الطالب بالإنجليزية"
            countryFieldName="phone.country"
            countryISOFieldName="phone.country_iso"
          />

          <CustomInput
            className="mt-6"
            name="password"
            control={form.control}
            label="كلمة السر"
            type="password"
          />

          <div className="text-primary-800 mt-1 inline-block w-full text-left font-medium underline">
            <Link href={"/forgetPassword"}>نسيت كلمة السر؟</Link>
          </div>

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
              // setToken(token);
              form.setValue("recaptcha_token", token);
            }}
          />

          <div className="mt-10 flex">
            <Button
              type="submit"
              className="ms-auto w-full max-w-40"
              disabled={form.formState.isSubmitting}
            >
              {!form.formState.isSubmitting ? (
                " تسجيل دخول"
              ) : (
                <SmallSpinner className="text-white" />
              )}
            </Button>
          </div>
        </form>
      </Form>
      {verify && <OTPNotVerifIed open={verify} setOpen={setVerify} />}
    </div>
  );
};
export default AuthPage;
