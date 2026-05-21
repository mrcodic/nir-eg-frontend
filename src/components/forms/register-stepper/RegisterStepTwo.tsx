"use client";

import CustomInput from "@/components/custom/customInput";
import DynamicSelect from "@/components/custom/DynamicSelect";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "../../../types/register.types";

type Props = {
  form: UseFormReturn<RegisterFormValues>;
};

export default function RegisterStepTwo({ form }: Props) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-6 gap-y-8">
      <DynamicSelect
        name="grade_id"
        control={form.control}
        label="الصف"
        queryKey="/grades"
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
  );
}

