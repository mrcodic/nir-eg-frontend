"use client";

import CustomCityStateField from "@/components/custom/CustomCityStateField";
import CustomInput from "@/components/custom/customInput";
import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "../../../types/register.types";

type Props = {
  form: UseFormReturn<RegisterFormValues>;
};

export default function RegisterStepOne({ form }: Props) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-6 gap-y-8 md:grid-cols-2">
      <CustomInput
        name="first_name"
        control={form.control}
        label="الاسم الأول"
      />

      <CustomInput
        name="last_name"
        control={form.control}
        label="الاسم الثاني"
      />

      <CustomPhoneInput
        name="phones.phone"
        form={form}
        label="رقم الطالب"
        info="يجب أن يكون رقم واتس اب"
        countryFieldName="phones.country"
        countryISOFieldName="phones.country_iso"
      />

      <CustomCityStateField form={form} />
    </div>
  );
}
