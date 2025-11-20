"use client";

import CustomInput from "@/components/custom/customInput";
import { Form } from "@/components/ui/form";
import { useAuthContext } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { newPasswordSchema } from "@/lib/schemas";
import { getLocalStorage } from "@/utils/clientFun";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import CustomLoader from "../custom/Loader";

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
      const response = await axios.post("/api?url=reset-password", v);

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
        <img src="/assets/LockColor.svg" className="w-[32px] h-[32px]" />
        <div>
          <h3 className="text-[#121212] text-[20px] font-bold">
            إعادة تعيين كلمة السر
          </h3>
          <p className="text-[16px] font-medium mt-[4px] text-gray-dark">
            أدخل كلمة السر الجديدة و قم بتأكيدها لتتمكن من الدخول لحسابك
          </p>
        </div>
      </div>

      <div className="h-px w-full mt-[16px] bg-primary-700" />
      <div className="h-px w-full mt-[2px] bg-[#523412]" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-[40px] w-full space-y-6 "
        >
          <CustomInput
            name="password"
            control={form.control}
            placeholder="كلمة السر"
            iconSrc="/assets/Lock.svg"
            type="password"
          />
          <CustomInput
            name="password_confirmation"
            control={form.control}
            placeholder="تأكيد كلمة السر"
            iconSrc="/assets/Lock.svg"
            type="password"
          />

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
  );
};
export default NewPasswordForm;
