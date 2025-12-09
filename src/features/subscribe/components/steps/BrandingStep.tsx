"use client";

import { CustomRadioGroup } from "@/components/fields";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { BrandingFormData } from "@/lib/validations/subscribe";
import type { TemplateOption } from "@/types/subscribe";
import { UseFormReturn } from "react-hook-form";
import { FileUpload, TemplateSelector } from "../shared";

interface BrandingStepProps {
  form: UseFormReturn<BrandingFormData>;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep?: boolean;
}

// Default templates - These would come from API in production
const templates: TemplateOption[] = [
  {
    id: "template-1",
    name: "عربي",
    previewImage: "/images/templates/template-1.png",
  },
  {
    id: "template-2",
    name: "عربي",
    previewImage: "/images/templates/template-2.png",
  },
  {
    id: "template-3",
    name: "عربي",
    previewImage: "/images/templates/template-3.png",
  },
];

// File upload configs
const fileUploads = [
  { name: "logoFile" as const, label: "صورة اللوجو", maxSize: 2 },
  { name: "faviconFile" as const, label: "صورة الأيقون", maxSize: 1 },
  { name: "coverFile" as const, label: "صورة الهيرو", maxSize: 5 },
];

const domainTypeOptions = [
  { value: "full-domain", label: "دومين مخصص" },
  { value: "sub-domain", label: "دومين فرعي" },
];

export default function BrandingStep({
  form,
  onNext,
  onPrevious,
  isLastStep = false,
}: BrandingStepProps) {
  const websiteName = form.watch("websiteName");
  const domainType = form.watch("domainType");

  console.log(form.getValues());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <CustomRadioGroup
          form={form}
          name="domainType"
          label="نوع النطاق"
          options={domainTypeOptions}
        />

        {/* Website Name - Custom with suffix */}
        <FormField
          control={form.control}
          name="websiteName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم الموقع</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="أدخل اسم الموقع"
                    className=" pl-32"
                    {...field}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-dark text-sm border-r border-gray-light pr-2">
                    {domainType === "full-domain" ? "" : "nir-edu.com."}
                  </span>
                </div>
              </FormControl>
              {websiteName && (
                <p className="text-sm text-gray-dark mt-1">
                  رابط موقعك سيكون:{" "}
                  <span className="text-primary-800 font-medium" dir="ltr">
                    {websiteName}
                    {domainType === "full-domain" ? "" : ".nir-edu.com"}
                  </span>
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Template Selection */}
        <FormField
          control={form.control}
          name="selectedTemplate"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TemplateSelector
                  templates={templates}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File Uploads */}
        <div className="grid grid-cols-1 gap-4 border-t border-gray-light pt-6">
          {fileUploads.map((upload) => (
            <FormField
              key={upload.name}
              control={form.control}
              name={upload.name}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      label={upload.label}
                      maxSize={upload.maxSize}
                      value={field.value}
                      onChange={field.onChange}
                      previewUrl={
                        field.value
                          ? URL.createObjectURL(field.value)
                          : undefined
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-center pt-6">
          <Button
            type="submit"
            className="w-28 bg-primary-800 hover:bg-primary-800/90"
          >
            {isLastStep ? "تأكيد" : "التالي"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-28"
            onClick={onPrevious}
          >
            السابق
          </Button>
        </div>
      </form>
    </Form>
  );
}
