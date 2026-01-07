"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import CustomInput from "@/components/custom/customInput";
import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import CustomLoader from "@/components/custom/Loader";
import { Verify } from "@/components/modals/Verify";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAuthContext } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import AuthHeader from "@/layouts/AuthHeader";
import { loginSchema } from "@/lib/schemas";
import { getUserPhoneFromStorage, presistUserPhone } from "@/lib/utils";
import { saveCookie } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";

const AuthPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [verify, setVerify] = useState(false);
  const { login } = useAuthContext();

  const searchParams = useSearchParams();
  const redirectSearch = searchParams.get("redirect");
  const redirect = redirectSearch ? decodeURIComponent(redirectSearch) : null;

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

  const onSubmit = async (v) => {
    try {
      const { phone, ...rest } = v;
      const response = await axios.post(
        "/api?url=auth/login",
        {
          ...rest,
          ...phone,
        },
        {
          withCredentials: true,
        },
      );

      await saveCookie(response?.data?.access_token);

      Cookies.remove("guest_token");
      queryClient.invalidateQueries({ queryKey: ["students/profile"] });

      login(response.data?.access_token);

      // storeGrade(response.data?.student.grade);
      presistUserPhone(phone.phone, phone.country);

      if (
        response?.data?.student?.type === 3 &&
        response?.data?.student?.has_center === true
      ) {
        router.push(
          redirect || `bundles/${response?.data?.student?.center_id}`,
        );
      } else if (
        response?.data?.student.type === 4 ||
        response?.data?.student.type === 5
      ) {
        router.push(
          redirect || `bundles?grade=${response?.data?.student?.grade}`,
        );
      } else if (
        response?.data?.student?.type === 3 &&
        response?.data?.student?.has_center === false
      ) {
        router.push(redirect || `profile`);
      }
    } catch (err) {
      console.log("💥 login error : ", err);

      if (err.status == 409) {
        localStorage.setItem("phone", v.phone);
        setVerify(true);
      } else {
        toast({
          status: err.status,
          description: err?.response?.data?.error?.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <>
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
                  <CustomLoader />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {verify && <Verify open={verify} setOpen={setVerify} />}
    </>
  );
};
export default AuthPage;
