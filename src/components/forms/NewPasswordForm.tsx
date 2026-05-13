"use client";

import CustomInput from "@/components/custom/customInput";
import { Form } from "@/components/ui/form";
import { useAuthContext } from "@/context/auth-context";
import { mutateClient } from "@/helpers/post-client";
import { useToast } from "@/hooks/use-toast";
import { newPasswordSchema } from "@/lib/schemas";
import { getLocalStorage } from "@/utils/clientFun";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import SmallSpinner from "../custom/SmallSpinner";

const NewPasswordForm = () => {
  const form = useForm({
    mode: "all",
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      phone: getLocalStorage("phone") || "",
      password: "",
      password_confirmation: "",
      recaptcha_token: "",
    },
  });

  const router = useRouter();
  const { toast } = useToast();
  const { token } = useAuthContext();

  const onSubmit = async (v) => {
    try {
      await mutateClient("/reset-password", {
        body: v,
      });

      toast({
        description: "تم تأكيد حفظ الباسورد الجديد بنجاح",
        icon: "success",
      });

      if (token) {
        router.push("/profile");
      } else {
        router.push("/login");
      }
    } catch (e) {
      toast({
        status: e.status,
        description: " حصلت مشكله ",
        icon: "error",
      });
    }
  };
  return (
    <div className="">
      <div className="flex gap-2">
        <img src="/assets/icons/LockColor.svg" className="h-[32px] w-[32px]" />
        <div>
          <h3 className="text-[20px] font-bold text-black">
            إعادة تعيين كلمة السر
          </h3>
          <p className="text-gray-dark mt-[4px] text-base font-medium">
            أدخل كلمة السر الجديدة و قم بتأكيدها لتتمكن من الدخول لحسابك
          </p>
        </div>
      </div>

      <div className="bg-gray-light mt-[16px] h-px w-full" />
      <div className="mt-[2px] h-px w-full bg-[#523412]" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-[40px] w-full space-y-6"
        >
          <CustomInput
            name="password"
            control={form.control}
            label="كلمة السر"
            iconSrc="/assets/lock-fill.svg"
            type="password"
          />
          <CustomInput
            name="password_confirmation"
            control={form.control}
            label="تأكيد كلمة السر"
            iconSrc="/assets/lock-fill.svg"
            type="password"
          />

          <div className="mt-14 flex gap-2">
            <span className="inline-block text-sm font-medium">
              ليس لديك حساب؟
            </span>
            <Link
              href={"/register"}
              className="text-sm font-bold text-[#523412] underline"
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
            className="border-gray-light bg-primary-800 mt-14 flex w-[265px] justify-center rounded-[10px] border py-2 font-bold text-white"
            disabled={form.formState.isSubmitting}
          >
            {!form.formState.isSubmitting ? (
              "   تأكيد"
            ) : (
              <SmallSpinner className="text-white" />
            )}
          </button>
        </form>
      </Form>
    </div>
  );
};
export default NewPasswordForm;
