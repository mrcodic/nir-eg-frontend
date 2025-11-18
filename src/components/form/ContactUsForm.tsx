"use client";

import {
  contactSchema,
  type ContactFormValues,
} from "@/lib/schemas/contact.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import submitContact from "@/actions/contact";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import CustomInput from "../fields/CustomInput";
import CustomTextarea from "../fields/CustomTextarea";

export default function ContactUsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "student",
      institution: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    setServerMessage(null);

    try {
      // Build FormData for Server Action
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          fd.append(k, String(v));
        }
      });

      const res = await submitContact(fd);

      if (res && (res as any).ok) {
        setServerMessage((res as any).message ?? "تم الإرسال");
        form.reset();
      } else {
        setServerMessage("حصل خطأ أثناء الإرسال");
      }
    } catch (err: any) {
      console.error(err);
      setServerMessage(err?.message ?? "حصل خطأ");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        // no client-side validation browser UI (we rely on RHF + zod)
        noValidate
      >
        <div className="grid grid-cols-1 gap-3">
          <CustomInput form={form} name="name" label="الاسم بالكامل" />

          <CustomInput form={form} name="email" label="البريد الالكتروني" />

          <CustomInput form={form} name="phone" label="رقم الجوال (اختيارى)" />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-right">
                  الوظيفة / الدور
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر الوظيفة / الدور" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">طالب / متعلم</SelectItem>
                      <SelectItem value="educator">مدرب / معلم</SelectItem>
                      <SelectItem value="company">شركة / جهة</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CustomInput
            form={form}
            name="institution"
            label="المؤسسة / الجهة"
            placeholder="قم بإدخال اسم المؤسسة"
          />

          <CustomTextarea
            form={form}
            name="message"
            label="الرسالة"
            placeholder="اترك رسالتك هنا"
          />
        </div>

        <div className="flex items-center justify-end mt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جارٍ الإرسال..." : "إرسال"}
          </Button>
        </div>

        {serverMessage && (
          <div className="text-sm text-right text-slate-700">
            {serverMessage}
          </div>
        )}
      </form>
    </Form>
  );
}
