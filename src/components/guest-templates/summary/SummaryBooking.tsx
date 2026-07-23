"use client";

import CustomCityStateField from "@/components/custom/CustomCityStateField";
import CustomInput from "@/components/custom/customInput";
import CustomRadioGroup from "@/components/custom/CustomRadioGroup";
import DynamicSelect from "@/components/custom/DynamicSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { SummaryTemplateContent } from "@/types/summary-template.types";

import { Animate } from "@/components/shared/Animate";
import { useSummaryBookingForm } from "@/hooks/useSummaryBookingForm";
import { Loader2 } from "lucide-react";
import SummarySectionHeading from "./SummarySectionHeading";

type SummaryBookingProps = {
  booking: SummaryTemplateContent["booking"];
};

function SummaryBooking({ booking }: SummaryBookingProps) {
  const { form, submit } = useSummaryBookingForm();

  return (
    <section
      id="summary-booking"
      className="bg-primary-800 scroll-mt-24 py-16 first:pt-40 last:first:min-h-screen sm:py-20 sm:first:pt-40"
      aria-labelledby="summary-booking-title"
    >
      <Animate preset="scaleIn" delay={0.1}>
        <div className="wrapper">
          <SummarySectionHeading
            {...booking}
            titleId="summary-booking-title"
            titleClassName="text-white"
            descriptionClassName="text-gray-200"
          />

          <Form {...form}>
            <form
              onSubmit={submit}
              className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white p-5 text-right shadow-[0_24px_40px_-24px_rgba(0,0,0,0.65)] sm:p-7"
              noValidate
            >
              <CustomRadioGroup
                control={form.control}
                name="type"
                label={booking.typeLabel}
                options={booking.applicantTypes}
              />

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CustomInput
                  control={form.control}
                  name="first_name"
                  label={booking.firstNameLabel}
                  placeholder={`أدخل ${booking.firstNameLabel}`}
                />
                <CustomInput
                  control={form.control}
                  name="last_name"
                  label={booking.lastNameLabel}
                  placeholder={`أدخل ${booking.lastNameLabel}`}
                />
                <CustomInput
                  control={form.control}
                  name="phone"
                  label={booking.phoneLabel}
                  placeholder="01012345678"
                  type="tel"
                />
                <DynamicSelect
                  control={form.control}
                  name="grade_id"
                  label={booking.gradeLabel}
                  queryKey="/grades"
                  className=""
                />
                <CustomCityStateField form={form} />
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                aria-busy={form.formState.isSubmitting}
                className="mt-6 h-15 w-full gap-2 rounded-xl text-base font-bold shadow-md transition-transform duration-200 hover:shadow-lg motion-reduce:transition-none"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  booking.submitLabel
                )}
              </Button>
            </form>
          </Form>
        </div>
      </Animate>
    </section>
  );
}

export default SummaryBooking;
