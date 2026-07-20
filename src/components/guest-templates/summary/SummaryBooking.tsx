"use client";

import CustomInput from "@/components/custom/customInput";
import CustomRadioGroup from "@/components/custom/CustomRadioGroup";
import CustomSelect from "@/components/custom/customSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { summaryBookingSchema } from "@/schemas/templates.schema";
import type {
  SummaryBookingFormValues,
  SummaryTemplateContent,
} from "@/types/summary-template.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import SummarySectionHeading from "./SummarySectionHeading";

type SummaryBookingProps = {
  booking: SummaryTemplateContent["booking"];
};

function SummaryBooking({ booking }: SummaryBookingProps) {
  const form = useForm<SummaryBookingFormValues>({
    resolver: zodResolver(summaryBookingSchema),
    defaultValues: {
      applicantType: "student",
      firstName: "",
      lastName: "",
      phone: "",
      grade: "first",
    },
    mode: "onBlur",
  });

  const handleBookingSubmit = () => {};

  return (
    <section
      id="summary-booking"
      className="bg-primary-800 scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="summary-booking-title"
    >
      <div className="wrapper">
        <SummarySectionHeading
          {...booking}
          titleId="summary-booking-title"
          titleClassName="text-white"
          descriptionClassName="text-gray-200"
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleBookingSubmit)}
            className="mx-auto mt-10 max-w-xl rounded-2xl bg-white p-5 text-right shadow-[0_24px_40px_-24px_rgba(0,0,0,0.65)] sm:p-7"
            noValidate
          >
            <CustomRadioGroup
              control={form.control}
              name="applicantType"
              label="أنت تسجل كـ"
              options={booking.applicantTypes}
            />

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <CustomInput
                control={form.control}
                name="firstName"
                label="الاسم الأول"
                placeholder="أدخل الاسم الأول"
              />
              <CustomInput
                control={form.control}
                name="lastName"
                label="الاسم الأخير"
                placeholder="أدخل الاسم الأخير"
              />
              <CustomInput
                control={form.control}
                name="phone"
                label="رقم هاتف الطالب"
                placeholder="01012345678"
                type="tel"
              />
              <CustomSelect
                control={form.control}
                name="grade"
                label="السنة الدراسية"
                placeholder="اختر السنة الدراسية"
                options={booking.grades}
              />
            </div>

            <Button
              type="submit"
              className="mt-6 h-12 w-full rounded-xl text-base font-bold transition-transform duration-200 hover:shadow-lg motion-reduce:transition-none"
            >
              {booking.submitLabel}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}

export default SummaryBooking;
