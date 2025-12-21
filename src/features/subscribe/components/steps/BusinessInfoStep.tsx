"use client";

import {
  CustomInput,
  CustomMultiSelect,
  CustomRadioGroup,
  CustomSelect,
  CustomTextarea,
} from "@/components/fields";
import { Form } from "@/components/ui/form";
import type { BusinessInfoFormData } from "@/lib/schemas/subscribe.schema";
import { UseFormReturn } from "react-hook-form";
import NavigationButtons from "../shared/NavigationButtons";

interface BusinessInfoStepProps {
  form: UseFormReturn<BusinessInfoFormData>;
  onNext: () => void;
  onPrevious: () => void;
}

const teacherTypeOptions = [
  { value: "individual", label: "فردي" },
  { value: "center", label: "سنتر" },
];

const teachingMethodOptions = [
  { value: "mixed", label: "مختلط" },
  { value: "offline", label: "أوفلاين" },
  { value: "online", label: "أونلاين" },
];

const howDidYouHearOptions = [
  { id: "social-media", name: "وسائل التواصل الاجتماعي" },
  { id: "friend", name: "صديق" },
  { id: "google", name: "بحث جوجل" },
  { id: "advertisement", name: "إعلان" },
  { id: "other", name: "أخرى" },
];

export default function BusinessInfoStep({
  form,
  onNext,
  onPrevious,
}: BusinessInfoStepProps) {
  const selectedGovernorate = form.watch("governorate");

  return (
    <Form {...form}>
      <form
        key={"business info form"}
        onSubmit={form.handleSubmit(onNext)}
        className="space-y-4"
        dir="rtl"
      >
        {/* Teacher Type */}
        <CustomRadioGroup
          form={form}
          name="teacherType"
          label="نوع المدرس"
          options={teacherTypeOptions}
        />

        <CustomInput
          form={form}
          name="brandName"
          label="اسم العلامة التجارية"
        />

        <CustomInput form={form} name="legalName" label="الاسم القانوني" />

        {/* Subjects & Grade Levels */}
        <CustomMultiSelect
          form={form}
          name="subjects"
          label="المواد الدراسية"
          queryKey="/subjects"
          placeholder="اختر المواد الدراسية"
          triggerClassName="w-full"
        />

        <CustomMultiSelect
          form={form}
          name="gradeLevels"
          label="الصفوف الدراسية"
          queryKey="/grades"
          placeholder="اختر الصفوف الدراسية"
          triggerClassName="w-full"
        />

        {/* Teaching Method */}
        <CustomRadioGroup
          form={form}
          name="teachingMethod"
          label="طريقة التدريس"
          options={teachingMethodOptions}
        />

        {/* Expected Students */}
        <CustomInput
          form={form}
          name="expectedStudents"
          label="عدد الطلاب المتوقع"
          type="number"
          min={1}
        />

        {/* Location Section */}
        <div className="border-t pt-4 mt-4 border-gray-light">
          <h3 className="text-lg font-bold mb-4">الموقع</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 items-start">
            <CustomInput
              form={form}
              name="country"
              label="الدولة"
              labelClassName="opacity-50"
              disabled
            />

            <CustomSelect
              form={form}
              name="governorate"
              label="المحافظة"
              queryKey="/governorates"
              placeholder="اختر المحافظة"
              onAfterSelect={() => {
                form.setValue("city", "");
              }}
            />

            <CustomSelect
              form={form}
              name="city"
              label="المدينة"
              queryKey={`/governorates/${selectedGovernorate}/cities`}
              placeholder="اختر المدينة"
              disabled={!selectedGovernorate}
            />
          </div>

          <div className="mt-4">
            <CustomInput
              form={form}
              name="address"
              label="العنوان"
              placeholder="أدخل العنوان بالتفصيل"
            />
          </div>
        </div>

        {/* How did you hear */}
        <CustomSelect
          form={form}
          name="howDidYouHear"
          label="كيف عرفت عنا؟"
          options={howDidYouHearOptions}
          placeholder="اختر طريقة معرفتك بنا"
        />

        {/* Additional Notes */}
        <CustomTextarea
          form={form}
          name="additionalNotes"
          label="ملاحظات إضافية"
          placeholder="هل تود إضافة ملاحظات؟ (اختياري)"
        />

        {/* Navigation Buttons */}
        <NavigationButtons onPrevious={onPrevious} />
      </form>
    </Form>
  );
}
