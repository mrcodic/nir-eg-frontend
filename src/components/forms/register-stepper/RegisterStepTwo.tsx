"use client";

import CustomInput from "@/components/custom/customInput";
import CustomSelect from "@/components/custom/customSelect";
import DynamicSelect from "@/components/custom/DynamicSelect";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "../../../types/register.types";

type Props = {
  form: UseFormReturn<RegisterFormValues>;
  showCenterOption: boolean;
};

export default function RegisterStepTwo({ form, showCenterOption }: Props) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-6 gap-y-8">
      <CustomSelect
        name="type"
        control={form.control}
        label="الحضور"
        options={[
          { value: "4", label: "طالب اونلاين" },
          ...(showCenterOption ? [{ value: "3", label: "طالب سنتر" }] : []),
        ]}
      />

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
