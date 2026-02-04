"use client";

import { useAuthContext } from "@/context/auth-context";
import { mutateClient } from "@/helpers/post-client";
import { useToast } from "@/hooks/use-toast";
import PaymentWhatsappLink from "@/modules/payment/components/PaymentWhatsappLink";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Label } from "recharts";
import { z } from "zod";
import SmallSpinner from "../custom/SmallSpinner";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  code: z.string().min(1, "الكود مطلوب"),
});

{
  /* <Congrats open={open} setOpen={setOpen} /> */
}

function CodePaymentForm({
  roomId,
  courseId,
  isCodeCenter,
}: {
  roomId: string;
  courseId: string;
  isCodeCenter?: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const { profile } = useAuthContext();

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

      if (isCodeCenterStudent) {
        response = await mutateClient("/students/subscriptions/claim-coupon", {
          body: {
            code: v.code.trim(),
            classroom_id: courseId,
            room_id: roomId,
          },
        });
      } else {
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
        description: "تم دفع قيمه الكورس بنجاح",
        icon: "success",
      });

      router.push(`/bundles/${courseId}`);
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
    <div className="mx-auto mt-16 w-full max-w-[760px]">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          <FormField
            control={control}
            name="code"
            render={({ field }) => (
              <FormItem className="border-primary-800 bg-background flex flex-col gap-1 rounded-lg border p-4">
                <Label className="text-gray-dark">الكود</Label>

                <div className="flex w-full items-start gap-4 sm:gap-6">
                  <div className="flex-1">
                    <Input
                      type="text"
                      name="code"
                      className=""
                      placeholder="أدخل الكود"
                      {...field}
                    />

                    <FormMessage />
                  </div>

                  <Button
                    type="submit"
                    className="h-11 sm:w-full sm:max-w-[125px]"
                    disabled={isSubmitting}
                  >
                    {!isSubmitting ? "إدخال" : <SmallSpinner />}
                  </Button>
                </div>
              </FormItem>
            )}
          />

          <p className="text-lg font-bold">
            أدخل الكود لتتمكن من عرض محتوى الباقة
          </p>
        </form>
      </Form>

      <div className="text-primary-800 relative my-10 text-center text-base font-medium">
        <hr className="border-primary-800 absolute inset-x-0 top-1/2 mx-4 -translate-y-1/2 sm:mx-20" />
        <span className="relative z-5 bg-white px-8">او</span>
      </div>

      <div>
        <h4 className="text-xl font-bold">
          لو مش معاك كود الدفع، كلمنا على واتساب
        </h4>

        <PaymentWhatsappLink className="mt-4" />
      </div>
    </div>
  );
}

export default CodePaymentForm;
