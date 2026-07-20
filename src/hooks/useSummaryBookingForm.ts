import { mutateClient } from "@/helpers/fetchers/post-client";
import { useToast } from "@/hooks/use-toast";
import { summaryBookingSchema } from "@/schemas/templates.schema";
import type { SummaryBookingFormValues } from "@/types/summary-template.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";

type SummaryBookingResponse = {
  message?: string;
};

const defaultValues: SummaryBookingFormValues = {
  type: 1,
  first_name: "",
  last_name: "",
  phone: "",
  grade_id: 0,
  state_id: 0,
  city_id: 0,
};

export function useSummaryBookingForm() {
  const { toast } = useToast();
  const form = useForm<SummaryBookingFormValues>({
    resolver: zodResolver(summaryBookingSchema),
    defaultValues,
    mode: "onBlur",
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      const response = await mutateClient<SummaryBookingResponse>(
        "/classroom-summer-data",
        { body: values },
      );

      toast({
        description: response?.message ?? "تم تسجيل بياناتك بنجاح",
        icon: "success",
      });
      form.reset(defaultValues);
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? (error.response?.data?.message ?? "تعذر إرسال بيانات التسجيل")
        : "تعذر إرسال بيانات التسجيل";

      toast({ description: message, icon: "error" });
    }
  });

  return { form, submit };
}
