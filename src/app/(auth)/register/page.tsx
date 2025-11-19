"use client";

import CustomInput from "@/components/custom/customInput";
import CustomSelect from "@/components/custom/customSelect";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomCityStateField from "@/components/custom/CustomCityStateField";
import CustomLoader from "@/components/custom/Loader";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/layouts/AuthLayout";
import { registerSchema } from "@/lib/schemas";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";

import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
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
    <AuthLayout img={"/assets/signup5.png"}>
      <>
        <div className="flex gap-2">
          <img src="/assets/BookColor.svg" className="w-[32px] h-[32px]" />
          <div>
            <h3 className="text-[#121212] text-[20px] font-bold">
              إنشاء حساب جديد
            </h3>
            <p className="text-[16px] font-medium mt-[4px] text-[#454545]">
              أدخل بياناتك لتتمكن من التسجيل معنا
            </p>
          </div>
        </div>

        <div className="h-px w-full mt-[16px] bg-primary-700" />
        <div className="h-px w-full mt-[2px] bg-[#523412]" />

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
            className="mt-[40px] w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6 items-end ">
              <CustomInput
                name="first_name"
                control={form.control}
                placeholder="الاسم الأول"
                iconSrc="/assets/user.svg"
              />

              <CustomInput
                name="last_name"
                control={form.control}
                placeholder="الاسم الأخير"
                iconSrc="/assets/user.svg"
              />

              <CustomPhoneInput
                name="phones.phone"
                form={form}
                placeholder="رقم هاتف الطالب بالإنجليزية"
                iconSrc="/assets/Phone1.svg"
                info="  يجب أن يكون رقم واتس اب"
                countryFieldName="phones.country"
                countryISOFieldName="phones.country_iso"
              />
              <CustomPhoneInput
                name="phones.parent__phone"
                form={form}
                placeholder="رقم هاتف ولى الأمر بالإنجليزية"
                iconSrc="/assets/Phone1.svg"
                info="يجب أن يكون رقم واتس اب"
                countryFieldName="phones.country"
                countryISOFieldName="phones.country_iso"
              />

              {/* <CustomInput
                name="phone"
                control={form.control}
                placeholder="رقم هاتف الطالب بالإنجليزية"
                iconSrc="/assets/Phone1.svg"
                info="  يجب أن يكون رقم واتس اب"
              />

              <CustomInput
                name="parent__phone"
                control={form.control}
                placeholder="رقم هاتف ولى الأمر بالإنجليزية"
                iconSrc="/assets/Phone1.svg"
                info="يجب أن يكون رقم واتس اب"
              /> */}

              <CustomCityStateField form={form} />

              {/* <CustomInput
                name="city"
                control={form.control}
                placeholder="ادخل المدينة"
                type="text"
                iconSrc="/assets/user.svg"
              /> */}

              <CustomSelect
                name="grade_id"
                control={form.control}
                placeholder="اختر الصف"
                iconSrc="/assets/Grade.svg"
                options={[
                  { value: "1", label: "الأول الثانوي" },
                  { value: "2", label: "الثاني الثانوي" },
                  { value: "3", label: "الثالث الثانوي" },
                ]}
              />
              <CustomSelect
                name="type"
                control={form.control}
                placeholder="نوع الحضور"
                iconSrc="/assets/Type.svg"
                options={[
                  { value: "3", label: "طالب سنتر" },
                  { value: "4", label: "طالب اونلاين" },
                  { value: "5", label: "اكواد سنتر" },
                ]}
              />
              <CustomInput
                name="password"
                control={form.control}
                placeholder="كلمة السر"
                type="password"
                iconSrc="/assets/user.svg"
              />

              <CustomInput
                name="password_confirmation"
                control={form.control}
                placeholder="تأكيد كلمة السر"
                type="password"
                iconSrc="/assets/user.svg"
              />
            </div>
            <div className="mt-[56px] flex gap-2">
              <span className="text-[14px] font-medium inline-block">
                لديك حساب بالفعل؟
              </span>
              <Link
                href={"/login"}
                className="  text-[14px] font-bold text-[#523412] underline"
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
            <button
              type="submit"
              className="bg-[#523412] text-white rounded-[10px] py-2 font-bold w-[265px] flex justify-center mt-[56px] border border-primary-700"
              disabled={form.formState.isSubmitting}
            >
              {!form.formState.isSubmitting ? "  إنشاء حساب" : <CustomLoader />}
            </button>
          </form>
        </Form>
      </>
    </AuthLayout>
  );
};
export default RegisterPage;
