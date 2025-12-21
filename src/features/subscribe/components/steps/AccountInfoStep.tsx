"use client";

import { CustomCheckbox, CustomInput, CustomSelect } from "@/components/fields";
import { Form } from "@/components/ui/form";
import PasswordInput from "@/components/ui/password-input";
import { axiosInstance } from "@/lib/axios-instance";
import type { AccountInfoFormData } from "@/lib/schemas/subscribe.schema";
import { startNewTimer } from "@/utils/otp-helpers";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import NavigationButtons from "../shared/NavigationButtons";

interface AccountInfoStepProps {
  form: UseFormReturn<AccountInfoFormData>;
  onNext: () => void;
  resetEmailVerificationForm: () => void;
}

// const languages = [
//   { value: "ar", label: "العربية" },
//   { value: "en", label: "English" },
// ];

const timezones = [
  { value: "Africa/Cairo", label: "Africa/Cairo" },
  { value: "Asia/Riyadh", label: "Asia/Riyadh" },
  { value: "Asia/Dubai", label: "Asia/Dubai" },
  { value: "Europe/London", label: "Europe/London" },
];

export default function AccountInfoStep({
  form,
  onNext,
  resetEmailVerificationForm,
}: AccountInfoStepProps) {
  async function handleAccountCreation(values: AccountInfoFormData) {
    try {
      const isFormDirty = form.formState.isDirty;
      const isFormValid = Object.keys(form.formState.errors).length === 0;

      console.log(values);

      if (!isFormDirty && isFormValid && values?.user_id) {
        onNext();
        return;
      }

      const res = await axiosInstance.post("/onboarding/account", {
        account: values,
      });

      console.log(res);

      form.setValue("user_id", res.data.data.user_id);
      form.setValue("email_verified", res.data.data.email_verified);

      const lastVerifiedEmail = localStorage.getItem("last_verified_email");

      if (res.data.data.email_verified && lastVerifiedEmail === values.email) {
        onNext();
        return;
      }

      toast.success("تم ارسال OTP لبريدك الإلكتروني");
      startNewTimer();
      onNext();
    } catch (error) {
      toast.error("حدث خطأ أثناء إنشاء الحساب");

      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form
        key={"account info form"}
        onSubmit={form.handleSubmit(handleAccountCreation)}
        className="space-y-4"
        dir="rtl"
      >
        {/* Full Name */}
        <CustomInput
          form={form}
          name="first_name"
          label="الاسم الأول"
          placeholder="قم بإدخال الاسم الأول"
        />
        <CustomInput
          form={form}
          name="last_name"
          label="الاسم الأخير"
          placeholder="قم بإدخال الاسم الأخير"
        />

        {/* Email */}
        <CustomInput
          form={form}
          name="email"
          label="البريد الإلكتروني"
          placeholder="قم بإدخال البريد الإلكتروني"
          type="email"
          onChange={() => {
            resetEmailVerificationForm();
          }}
        />

        {/* Phone */}
        <CustomInput
          form={form}
          name="phone"
          label="رقم الهاتف"
          placeholder="قم بإدخال رقم الهاتف"
          type="tel"
          className="text-right"
        />

        {/* Password - Custom with toggle */}
        <PasswordInput form={form} name="password" />

        {/* Confirm Password - Custom with toggle */}
        <PasswordInput
          form={form}
          name="confirmPassword"
          label="تأكيد كلمة المرور"
        />

        {/* Language & Timezone - Two columns */}
        {/* <CustomSelect
          form={form}
          name="language"
          label="اللغة"
          placeholder="اختر اللغة"
          options={languages}
          triggerClassName="w-full"
        /> */}

        <CustomSelect
          form={form}
          name="timezone"
          label="المنطقة الزمنية"
          placeholder="اختر المنطقة الزمنية"
          options={timezones}
          triggerClassName="w-full"
        />

        {/* Checkboxes */}
        <div className="space-y-3 pt-4 ">
          <CustomCheckbox
            form={form}
            name="acceptTerms"
            label={
              <p>
                أوافق على{" "}
                <Link
                  className="text-primary-800 underline"
                  href="/terms"
                  target="_blank"
                >
                  شروط الخدمة
                </Link>
              </p>
            }
          />

          <CustomCheckbox
            form={form}
            name="acceptPrivacy"
            label={
              <p>
                أوافق على{" "}
                <Link
                  className="text-primary-800 underline"
                  href="/privacy"
                  target="_blank"
                >
                  سياسة الخصوصية
                </Link>
              </p>
            }
          />

          <CustomCheckbox
            form={form}
            name="acceptSms"
            label="أوافق على استقبال رسائل SMS ترويجية"
          />

          <CustomCheckbox
            form={form}
            name="acceptWhatsapp"
            label="أوافق على استقبال رسائل واتساب والتحديثات"
          />
        </div>

        {/* Submit Button */}
        <NavigationButtons
          isFirstStep
          isPending={form.formState.isSubmitting}
          pendingText="جاري الإرسال..."
        />
      </form>
    </Form>
  );
}
