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

// Mock data - replace with actual data from API
const subjects = [
  { value: "math", label: "الرياضيات" },
  { value: "arabic", label: "اللغة العربية" },
  { value: "english", label: "اللغة الإنجليزية" },
  { value: "science", label: "العلوم" },
  { value: "physics", label: "الفيزياء" },
  { value: "chemistry", label: "الكيمياء" },
];

const gradeLevels = [
  { value: "primary-1", label: "الصف الأول الابتدائي" },
  { value: "primary-2", label: "الصف الثاني الابتدائي" },
  { value: "primary-3", label: "الصف الثالث الابتدائي" },
  { value: "prep-1", label: "الصف الأول الإعدادي" },
  { value: "prep-2", label: "الصف الثاني الإعدادي" },
  { value: "prep-3", label: "الصف الثالث الإعدادي" },
  { value: "sec-1", label: "الصف الأول الثانوي" },
  { value: "sec-2", label: "الصف الثاني الثانوي" },
  { value: "sec-3", label: "الصف الثالث الثانوي" },
];

// const countries = [{ value: "egypt", label: "مصر" }];

const governorates = [
  { value: "cairo", label: "القاهرة" },
  { value: "giza", label: "الجيزة" },
  { value: "alexandria", label: "الإسكندرية" },
];

const cities: Record<string, { value: string; label: string }[]> = {
  cairo: [
    { value: "nasr-city", label: "مدينة نصر" },
    { value: "heliopolis", label: "مصر الجديدة" },
    { value: "maadi", label: "المعادي" },
  ],
  giza: [
    { value: "dokki", label: "الدقي" },
    { value: "mohandessin", label: "المهندسين" },
    { value: "6october", label: "6 أكتوبر" },
  ],
  alexandria: [
    { value: "montaza", label: "المنتزة" },
    { value: "sidi-bishr", label: "سيدي بشر" },
  ],
};

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
  { value: "social-media", label: "وسائل التواصل الاجتماعي" },
  { value: "friend", label: "صديق" },
  { value: "google", label: "بحث جوجل" },
  { value: "advertisement", label: "إعلان" },
  { value: "other", label: "أخرى" },
];

export default function BusinessInfoStep({
  form,
  onNext,
  onPrevious,
}: BusinessInfoStepProps) {
  const selectedGovernorate = form.watch("governorate");
  const availableCities = selectedGovernorate
    ? cities[selectedGovernorate] || []
    : [];

  return (
    <Form {...form}>
      <form
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
          options={subjects}
          placeholder="اختر المواد الدراسية"
          triggerClassName="w-full"
        />

        <CustomMultiSelect
          form={form}
          name="gradeLevels"
          label="الصفوف الدراسية"
          options={gradeLevels}
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
          placeholder="20"
          type="number"
          min={1}
        />

        {/* Location Section */}
        <div className="border-t pt-4 mt-4 border-gray-light">
          <h3 className="text-lg font-bold mb-4">الموقع</h3>

          {/* <CustomSelect
            form={form}
            name="country"
            label="الدولة"
            options={countries}
            placeholder="اختر الدولة"
          /> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-start">
            <CustomSelect
              form={form}
              name="governorate"
              label="المحافظة"
              options={governorates}
              placeholder="اختر المحافظة"
            />

            <CustomSelect
              form={form}
              name="city"
              label="المدينة"
              options={availableCities}
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
