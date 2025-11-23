"use client";

import CustomInput from "@/components/custom/customInput";
import CustomSelect from "@/components/custom/customSelect";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomCityStateField from "@/components/custom/CustomCityStateField";
import CustomLoader from "@/components/custom/Loader";
import { useToast } from "@/hooks/use-toast";
import { registerSchema } from "@/lib/schemas";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";

import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import { Button } from "@/components/ui/button";
import AuthHeader from "@/layouts/AuthHeader";
import { presistUserPhone } from "@/lib/utils";
import { useForm } from "react-hook-form";

const RegisterPage = () => {
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
      type: "",
      // city: "",
      state_id: "",
      city_id: "",
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (v) => {
    try {
      const { phones, ...rest } = v;
      const response = await axios.post("/api?url=auth/register", {
        ...rest,
        ...phones,
      });

      presistUserPhone(phones.phone, phones.country);

      if (response.status) {
        // const otp = await getOtp(localStorage.getItem("phone"));
        // if (otp.status) {
        //   toast({
        //     description: " بعتنالك otp عبر sms  ",
        //     icon: "success",
        //   });

        // }

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

  console.log(form.getValues());
  console.log("errors : ", form.formState.errors);

  return (
    <>
      <AuthHeader
        title="إنشاء حساب جديد"
        description=" أدخل بياناتك لتتمكن من التسجيل معنا"
      />

      <div className="h-px w-full mt-2 bg-gray-light" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            const first = Object.values(errors)?.[0];
            // show first validation message (zod) or a fallback
            const msg = first?.message || "Please fill all required fields.";
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6 items-start ">
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

            <CustomSelect
              name="grade_id"
              control={form.control}
              label="الصف"
              options={[
                { value: "1", label: "الأول الثانوي" },
                { value: "2", label: "الثاني الثانوي" },
                { value: "3", label: "الثالث الثانوي" },
              ]}
            />
            <CustomSelect
              name="type"
              control={form.control}
              label="نوع الحضور"
              options={[
                { value: "3", label: "طالب سنتر" },
                { value: "4", label: "طالب اونلاين" },
                { value: "5", label: "اكواد سنتر" },
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
            <span className=" font-medium inline-block text-gray-dark">
              لديك حساب بالفعل؟
            </span>
            <Link
              href={"/login"}
              className="  text-sm font-bold text-primary-800 underline px-4 rounded-md border border-gray-light"
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
          <div className="flex mt-10">
            <Button
              type="submit"
              className="ms-auto max-w-40 w-full"
              disabled={form.formState.isSubmitting}
            >
              {!form.formState.isSubmitting ? "إنشاء حساب" : <CustomLoader />}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
export default RegisterPage;
