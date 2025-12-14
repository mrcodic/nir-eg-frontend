"use client";

import { CustomCheckbox, CustomInput, CustomSelect } from "@/components/fields";
import { Form } from "@/components/ui/form";
import PasswordInput from "@/components/ui/password-input";
import type { AccountInfoFormData } from "@/lib/schemas/subscribe.schema";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import NavigationButtons from "../shared/NavigationButtons";

interface AccountInfoStepProps {
  form: UseFormReturn<AccountInfoFormData>;
  onNext: () => void;
  resetEmailVerificationForm: () => void;
}

const languages = [
  { value: "ar", label: "العربية" },
  { value: "en", label: "English" },
];

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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
        {/* Full Name */}
        <CustomInput
          form={form}
          name="fullName"
          label="الاسم بالكامل"
          placeholder="قم بإدخال الاسم بالكامل"
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
        <CustomSelect
          form={form}
          name="language"
          label="اللغة"
          placeholder="اختر اللغة"
          options={languages}
          triggerClassName="w-full"
        />

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
                <Link className="text-primary-800 underline" href="/terms">
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
                <Link className="text-primary-800 underline" href="/policy">
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
        <NavigationButtons isFirstStep />
      </form>
    </Form>
  );
}
