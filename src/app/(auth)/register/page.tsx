"use client";

import CustomInput from "@/components/custom/customInput";
import CustomSelect from "@/components/custom/customSelect";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomCityStateField from "@/components/custom/CustomCityStateField";
import SmallSpinner from "@/components/custom/SmallSpinner";
import { useToast } from "@/hooks/use-toast";
import { registerSchema } from "@/lib/schemas";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";

import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import DynamicSelect from "@/components/custom/DynamicSelect";
import { Button } from "@/components/ui/button";
import { mutateClient } from "@/helpers/post-client";
import AuthHeader from "@/layouts/AuthHeader";
import { presistUserPhone } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useTenant } from "@/context/TenantProvider";

const RegisterPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { center_enabled } = useTenant();

  const form = useForm({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",

      phones: {
        country: "+20",
        country_iso: "EG",
        phone: "",
        parent__phone: "",
      },

      password: "",
      password_confirmation: "",
      grade_id: "",
      type: "4",
      // city: "",
      state_id: "",
      city_id: "",

      recaptcha_token: "",
    },
  });

  const onSubmit = async (v) => {
    try {
      const { phones, ...rest } = v;

      const response = await mutateClient("/auth/register", {
        body: {
          ...rest,
          ...phones,
        },
      });

      presistUserPhone(phones.phone, phones.country);

      if (response.status) {
        toast({
          description: "تم إنشاء الحساب بنجاح سجل دخولك الان",
          icon: "success",
        });

        router.push("/login");
      }
    } catch (err) {
      toast({
        status: err.status,
        description: err?.response?.data?.error?.errors?.phone[0],
        icon: "error",
      });
    }
  };

  return (
    <>
      <AuthHeader
        title="إنشاء حساب جديد"
        description=" أدخل بياناتك لتتمكن من التسجيل معنا"
      />

      <div className="bg-gray-light mt-2 h-px w-full" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            const first = Object.values(errors)?.[0];
            // show first validation message (zod) or a fallback
            const msg = first?.message || "قم بملء جميع الحقول المطلوبة";
            console.error("Form validation errors:", errors);
            // toast is already in your file
            // @ts-ignore
            typeof msg === "string" && // defensive
              typeof window !== "undefined" &&
              // use your existing toast
              // you can customize text as you like
              toast({ description: msg, icon: "error" });
          })}
          className="mt-10 w-full"
        >
          <div className="grid grid-cols-1 items-start gap-x-6 gap-y-8 md:grid-cols-2">
            <CustomInput
              name="first_name"
              control={form.control}
              label="الاسم الأول"
            />

            <CustomInput
              name="last_name"
              control={form.control}
              label="الاسم الأخير"
            />

            <CustomPhoneInput
              name="phones.phone"
              form={form}
              label="رقم هاتف الطالب بالإنجليزية"
              info="  يجب أن يكون رقم واتس اب"
              countryFieldName="phones.country"
              countryISOFieldName="phones.country_iso"
            />

            <CustomPhoneInput
              name="phones.parent__phone"
              form={form}
              label="رقم هاتف ولى الأمر بالإنجليزية"
              info="يجب أن يكون رقم واتس اب"
              countryFieldName="phones.country"
              countryISOFieldName="phones.country_iso"
            />

            <CustomCityStateField form={form} />

            <DynamicSelect
              name="grade_id"
              control={form.control}
              label="الصف"
              queryKey="/grades"
            />

            <CustomSelect
              name="type"
              control={form.control}
              label="نوع الحضور"
              options={[
                { value: "4", label: "طالب اونلاين" },
                // { value: "5", label: "اكواد سنتر" },
                { ...(center_enabled && { value: "3", label: "طالب سنتر" }) },
              ]}
            />
            <CustomInput
              name="password"
              control={form.control}
              label="كلمة السر"
              type="password"
            />

            <CustomInput
              name="password_confirmation"
              control={form.control}
              label="تأكيد كلمة السر"
              type="password"
            />
          </div>

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
              {!form.formState.isSubmitting ? "إنشاء حساب" : <SmallSpinner />}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
export default RegisterPage;
