"use client";

import { useAuthContext } from "@/context/auth-context";
import { mutateClient } from "@/helpers/fetchers/post-client";
import { useToast } from "@/hooks/use-toast";
import PaymentWhatsappLink from "@/modules/payment/components/PaymentWhatsappLink";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SmallSpinner from "../custom/SmallSpinner";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const formSchema = z.object({
  code: z.string().min(1, "الكود مطلوب"),
});

function CodePaymentForm({
  roomId,
  courseId,
  isCodeCenter,
  bundleId,
}: {
  roomId?: string;
  bundleId?: string;
  courseId?: string;
  isCodeCenter?: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const { profile } = useAuthContext();
  const queryClient = useQueryClient();

  const form = useForm({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    setError,
  } = form;

  const isCodeCenterStudent = isCodeCenter || profile?.type === 5;

  const onSubmit = async (v) => {
    try {
      let response;

      if (bundleId) {
        response = await mutateClient("/students/subscripe-bundle", {
          body: {
            code: v.code.trim(),
            bundle_id: bundleId,
            grade_id: profile?.grade,
          },
        });
      } else if (isCodeCenterStudent) {
        response = await mutateClient("/students/subscriptions/claim-coupon", {
          body: {
            code: v.code.trim(),
            classroom_id: courseId,
            room_id: roomId,
          },
        });
      } else {
        // center student
        response = await mutateClient("/students/subscribe-room", {
          body: {
            code: v.code.trim(),
            room_id: roomId,
            center_id: courseId,
          },
        });
      }

      console.log("response : ", response);

      toast({
        description: "تم الاشتراك بنجاح",
        icon: "success",
      });

      if (roomId) {
        queryClient.invalidateQueries({
          queryKey: [`roomLessons`, roomId],
        });
      }

      if (bundleId) {
        queryClient.invalidateQueries({
          queryKey: [`bundleRooms`, courseId],
        });
      }

      if (bundleId) {
        router.push(`/bundles/bundle-details/${bundleId}`);
      } else {
        router.push(`/bundles/${courseId}${roomId ? `/${roomId}` : ""}`);
      }
    } catch (e) {
      const errorMessage =
        e?.response?.data?.error?.errors?.code[0] ||
        e?.response?.data?.error?.message ||
        e?.response?.data?.message ||
        "كود غير صحيح";

      setError("code", {
        type: "manual",
        message: errorMessage,
      });

      toast({
        description: errorMessage,
        icon: "error",
      });
    }
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-[760px]">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          <FormField
            control={control}
            name="code"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="border-primary-800 bg-background flex flex-col gap-1 rounded-lg border p-4">
                <Label aria-invalid={!!error} className="text-gray-dark">
                  الكود
                </Label>

                <div className="flex w-full items-start gap-4 sm:gap-6">
                  <div className="flex-1">
                    <Input
                      type="text"
                      name="code"
                      aria-invalid={!!error}
                      placeholder="أدخل الكود"
                      className="bg-white"
                      {...field}
                    />

                    <FormMessage />
                  </div>

                  <Button
                    type="submit"
                    className="h-11 sm:w-full sm:max-w-[125px]"
                    disabled={isSubmitting}
                  >
                    {!isSubmitting ? (
                      "إدخال"
                    ) : (
                      <SmallSpinner className="text-white" />
                    )}
                  </Button>
                </div>
              </FormItem>
            )}
          />

          <p className="text-base font-bold sm:text-lg">
            أدخل الكود لتتمكن من عرض محتوى الباقة
          </p>
        </form>
      </Form>

      <div className="text-primary-800 relative my-10 text-center text-base font-medium">
        <hr className="border-primary-800 absolute inset-x-0 top-1/2 mx-4 -translate-y-1/2 sm:mx-20" />
        <span className="relative z-5 bg-white px-8">او</span>
      </div>

      <PaymentWhatsappLink className="mt-4" />
    </div>
  );
}

export default CodePaymentForm;
