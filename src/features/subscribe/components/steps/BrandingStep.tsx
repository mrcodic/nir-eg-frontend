"use client";

// import { CustomRadioGroup } from "@/components/fields";
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
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandingStepProps {
  form: UseFormReturn<BrandingFormData>;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
}

// File upload configs
const fileUploads = [
  {
    name: "logoFile" as const,
    label: "صورة اللوجو (اختيارى)",
    maxSize: 2,
    dimensions: "512x512 px",
    hint: {
      exampleImage: "/assets/hints/logo-example.png",
      description: "سيظهر اللوجو في أعلى الموقع ",
    },
    examplePreview: ({ file }: { file: File | undefined | null }) => {
      if (!file) return null;
      return (
        <div className="mt-2 h-20 bg-primary-50 rounded-sm flex items-center ps-4">
          <Image
            src={URL.createObjectURL(file)}
            alt="Logo Example"
            width={110}
            height={48}
            className="object-contain w-[110px] h-12"
          />
        </div>
      );
    },
  },
  {
    name: "faviconFile" as const,
    label: "صورة الأيقون (اختيارى)",
    maxSize: 2,
    dimensions: "32x32 px",
    hint: {
      exampleImage: "/assets/hints/favicon-example.png",
      description: "الأيقون الصغير الذي يظهر في تبويب المتصفح",
    },
    examplePreview: ({ file }: { file: File | undefined | null }) => {
      if (!file) return null;
      return (
        <div className="bg-primary-800 pt-2 px-2 ps-8 flex justify-end rounded-t-sm">
          <div className="mt-2 bg-background rounded-t-lg px-3 py-2  flex items-center gap-2 w-full max-w-72">
            <X className="text-gray-600 size-4 " />
            <span className="text-xs text-gray-700 truncate max-w-[120px] ">
              موقعك
            </span>
            <Image
              src={URL.createObjectURL(file)}
              alt="Favicon Example"
              width={16}
              height={16}
              className="object-contain w-4 h-4 ms-auto"
            />
          </div>
        </div>
      );
    },
  },
  {
    name: "coverFile" as const,
    label: "صورة الهيرو (اختيارى)",
    maxSize: 5,
    // aspect: 1.91,
    dimensions: "512x512 px",
    hint: {
      exampleImage: "/assets/hints/hero-example.png",
      description: "صوره الهيرو التى تظهر فى الصفحة الرئيسية الخاصة بموقعك",
    },
  },
];

// const domainTypeOptions = [
//   { value: "custom", label: "دومين مخصص" },
//   { value: "subdomain", label: "دومين فرعي" },
// ];

export default function BrandingStep({
  form,
  onNext,
  onPrevious,
  isLastStep = false,
  isSubmitting = false,
}: BrandingStepProps) {
  // const domainType = useWatch({
  //   control: form.control,
  //   name: "domainType",
  // });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        {/* <CustomRadioGroup
          form={form}
          name="domainType"
          label="نوع النطاق"
          options={domainTypeOptions}
        /> */}

        {/* Website Name - Custom with suffix */}
        <FormField
          control={form.control}
          name="websiteName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم الموقع</FormLabel>
              <FormControl>
                <div className="relative flex mt-2 items-center gap-4">
                  {/* {domainType === "subdomain" && ( */}
                  <span className=" border h-11 flex items-center border-gray-light text-gray-dark text-sm px-2 py-1 whitespace-nowrap rounded-lg bg-background">
                    nir-edu.com.
                  </span>
                  {/* )} */}
                  <Input placeholder="أدخل اسم الموقع" {...field} />
                </div>
              </FormControl>
              {field.value && (
                <p className="text-sm text-gray-dark mt-1">
                  رابط موقعك سيكون:{" "}
                  <span className="text-primary-800 font-medium" dir="ltr">
                    {field.value}.nir-edu.com
                    {/* {domainType === "custom" ? "" : ".nir-edu.com"} */}
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
        <div className="grid grid-cols-1 border-t border-gray-light pt-6 divide-y divide-gray-light">
          {fileUploads.map((upload, index, arr) => (
            <FormField
              key={upload.name}
              control={form.control}
              name={upload.name}
              render={({ field, fieldState }) => (
                <FormItem
                  className={cn("py-4", index !== arr.length - 1 && "pb-4")}
                >
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
                      isInvalid={fieldState.error !== undefined}
                      dimensions={upload.dimensions}
                      hint={upload.hint}
                      examplePreview={upload?.examplePreview?.({
                        file: field.value,
                      })}
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
