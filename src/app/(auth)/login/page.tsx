"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { deleteCookie, saveCookie } from "../../../utils/api";

import CustomInput from "@/components/custom/customInput";
import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import CustomLoader from "@/components/custom/Loader";
import { NewFeaturesModal } from "@/components/modals/NewFeaturesModal";
import { Verify } from "@/components/modals/Verify";
import { Form } from "@/components/ui/form";
import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/layouts/AuthLayout";
import { loginSchema } from "@/lib/schemas";
import { getUserPhoneFromStorage, presistUserPhone } from "@/lib/utils";
import { getDataClient } from "@/utils/clientFun";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";

const AuthPage = () => {
  const router = useRouter();
  const modal = useModal();
  const { toast } = useToast();

  const [verify, setVerify] = useState(false);
  const { login, storeGrade } = useAuthContext();

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
        }
      );

      await saveCookie(response?.data?.access_token);
      await deleteCookie("guest_token");

      login(response.data?.access_token);
      storeGrade(response.data?.student.grade);
      localStorage.setItem("student", JSON.stringify(response.data?.student));
      presistUserPhone(phone.phone, phone.country);

      // check for new features to notify the student
      try {
        const features = await getDataClient({
          queryKey: ["settings/newFeatures"],
        });

        // 1) check if feature enabled
        if (features?.data?.enabled === 1) {
          // 2) check if seen the features
          const savedFeatures = localStorage.getItem("more-features");
          const stringifiedFeatures = JSON.stringify(features?.data);

          if (!savedFeatures || savedFeatures !== stringifiedFeatures) {
            modal.setDialogContent(
              <NewFeaturesModal features={features?.data} />
            );
            modal.openModal();
            localStorage.setItem("more-features", stringifiedFeatures);
          }
        }
      } catch (e) {
        console.log("features error : ", e);
      }

      if (
        response?.data?.student?.type === 3 &&
        response?.data?.student?.has_center === true
      ) {
        router.push(
          redirect || `bundles/${response?.data?.student?.center_id}`
        );
      } else if (
        response?.data?.student.type === 4 ||
        response?.data?.student.type === 5
      ) {
        router.push(
          redirect || `bundles?grade=${response?.data?.student?.grade}`
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
    <AuthLayout img={"/assets/signin5.png"}>
      <div className="">
        <div className="flex gap-2">
          <img src="/assets/BookColor.svg" className="w-[32px] h-[32px]" />
          <div>
            <h3 className="text-[#121212] text-[20px] font-bold">
              تسجيل الدخول
            </h3>
            <p className="text-[16px] font-medium mt-[4px] text-[#454545]">
              أدخل رقم الهاتف المسجل لدينا و كلمة السر لتتمكن من الدخول لحسابك
            </p>
          </div>
        </div>

        <div className="h-px w-full mt-[16px] bg-primary-700" />
        <div className="h-px w-full mt-[2px] bg-[#523412]" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-[40px] w-full space-y-4"
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
              name="phone.phone"
              control={form.control}
              placeholder="رقم هاتف الطالب"
              iconSrc="/assets/Phone1.svg"
            /> */}
            <CustomInput
              name="password"
              control={form.control}
              placeholder="كلمة السر"
              iconSrc="/assets/user.svg"
              type="password"
            />

            <div className="text-[#523412] mt-[4px] text-[12px]  w-full  underline font-medium inline-block text-left ">
              <Link href={"/forgetPassword"}>نسيت كلمة السر؟</Link>
            </div>

            <div className="mt-[56px] flex gap-2">
              <span className="text-[14px] font-medium inline-block">
                ليس لديك حساب؟
              </span>
              <Link
                href={"/register"}
                className="  text-[14px] font-bold text-[#523412] underline"
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
              className="bg-[#523412] mt-[48px] text-xl text-white rounded-[8px] py-2 font-bold w-[269px] flex justify-center  border-2 border-primary-700"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {!form.formState.isSubmitting ? " تسجيل دخول" : <CustomLoader />}
            </button>
          </form>
        </Form>
      </div>

      <Verify open={verify} setOpen={setVerify} />
    </AuthLayout>
  );
};
export default AuthPage;
