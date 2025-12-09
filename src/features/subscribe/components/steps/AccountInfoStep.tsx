"use client";

import { CustomCheckbox, CustomInput, CustomSelect } from "@/components/fields";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { AccountInfoFormData } from "@/lib/validations/subscribe";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import NavigationButtons from "../shared/NavigationButtons";

interface AccountInfoStepProps {
  form: UseFormReturn<AccountInfoFormData>;
  onNext: () => void;
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
}: AccountInfoStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    className="pl-10"
                    {...field}
                    aria-invalid={fieldState.error ? true : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-dark hover:text-primary-800"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password - Custom with toggle */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>تأكيد كلمة المرور</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="أكد كلمة المرور"
                    className="pl-10"
                    {...field}
                    aria-invalid={fieldState.error ? true : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-dark hover:text-primary-800"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
