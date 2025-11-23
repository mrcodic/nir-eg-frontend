"use client";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { unlockSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CustomLoader from "../custom/Loader";

//https://dev.more-english.net/api/v1/students/subscripe-bundle

const PaymentForm = ({ grade, setRefresh }) => {
  const form = useForm({
    mode: "all",
    resolver: zodResolver(unlockSchema),
    defaultValues: {
      grade_id: grade,
      code: "",
    },
  });
  const param = useParams();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const onSubmit = async (v) => {
    try {
      const response = await axios.post(
        "/api?url=students/subscripe-classroom",
        {
          ...v,
          code: v.code.trim(),
          class_room_id: courseId || param.SingleCourse,
        }
      );
      // setOpen(true);

      toast({
        description: "      تم    دفع قيمه الكورس بنجاح",
        icon: "success",
      });
      // setRefresh((prev) => !prev);

      router.refresh();
      router.push(`/bundles/${courseId || param.SingleCourse}`);
    } catch ({ response }) {
      toast({
        description:
          // response?.data?.error?.errors?.code[0] || response.data?.error.message,و
          "كود غير صحيح",
        icon: "error",
      });
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-[40px] w-full space-y-6 "
      >
        <div className="flex flex-col">
          <h2 className="text-[#523412] text-sm">الكود</h2>
          <div className="flex flex-wrap w-full gap-[24px]">
            <div className="bg-white flex-1 relative  border-[#523412] border-b p-2 mt-[4px]">
              <input
                type="text"
                className="w-full mt-[8px] text-[#121212] font-medium text-sm border-none focus:outline-hidden placeholder:text-[#121212]"
                placeholder="أدخل الكود"
                {...form.register("code")}
              />
              {form.formState.errors.code && (
                <span className="text-red-700 text-sm absolute -bottom-6 right-0">
                  {" "}
                  من فضلك ادخل الكود
                </span>
              )}
            </div>
            <button
              className="bg-primary w-1/4 text-[10px] md:text-xl rounded-[10px] self-end border border-gray-light px-[24px] text-white h-[30px] md:h-[40px]"
              disabled={form.formState.isSubmitting}
            >
              {!form.formState.isSubmitting ? "   إدخال" : <CustomLoader />}
            </button>
          </div>
        </div>
        {/* <button
            type="submit"
            className="bg-[#523412] text-white rounded-[10px] py-2 font-bold w-[265px] flex justify-center mt-[56px] border border-gray-light"
            disabled={form.formState.isSubmitting}
          >
            {!form.formState.isSubmitting ? "   تأكيد" : <CustomLoader />}
          </button> */}
      </form>
      {/* <Congrats open={open} setOpen={setOpen} /> */}
    </Form>
  );
};
export default PaymentForm;
