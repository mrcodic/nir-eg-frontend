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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-right">
                  الاسم بالكامل
                </FormLabel>
                <FormControl>
                  <Input placeholder="قم بإدخال الاسم بالكامل" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-right">
                  البريد الإلكتروني
                </FormLabel>
                <FormControl>
                  <Input placeholder="قم بإدخال البريد الإلكتروني" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-right">
                  رقم الهاتف (اختياري)
                </FormLabel>
                <FormControl>
                  <Input placeholder="قم بإدخال رقم الهاتف" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-right">المؤسسة</FormLabel>
                <FormControl>
                  <Input placeholder="قم بإدخال اسم المؤسسة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-right">الرسالة</FormLabel>
                <FormControl>
                  <Textarea placeholder="اترك رسالتك هنا" rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
