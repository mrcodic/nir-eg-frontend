"use client";

import { CustomRadioGroup } from "@/components/fields";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { BrandingFormData } from "@/lib/schemas/subscribe.schema";
import { UseFormReturn } from "react-hook-form";
import { ColorPicker, FileUpload, TemplateSelector } from "../shared";
import NavigationButtons from "../shared/NavigationButtons";

interface BrandingStepProps {
  form: UseFormReturn<BrandingFormData>;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
}

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
  isSubmitting = false,
}: BrandingStepProps) {
  const websiteName = form.watch("websiteName");
  const domainType = form.watch("domainType");

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
                <div className="relative flex mt-2 items-center gap-4">
                  {domainType === "sub-domain" && (
                    <span className=" border h-11 flex items-center border-gray-light text-gray-dark text-sm px-2 py-1 whitespace-nowrap rounded-lg bg-background">
                      nir-edu.com.
                    </span>
                  )}
                  <Input placeholder="أدخل اسم الموقع" {...field} />
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
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Brand Color */}
        <FormField
          control={form.control}
          name="brandColor"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ColorPicker
                  value={field.value}
                  onChange={field.onChange}
                  label="اللون الأساسي"
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
        <NavigationButtons
          onPrevious={onPrevious}
          isPending={isSubmitting}
          isLastStep={isLastStep}
        />
      </form>
    </Form>
  );
}
