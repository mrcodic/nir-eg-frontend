"use client";
import { useToast } from "@/hooks/use-toast";
import { unlockSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SmallSpinner from "../custom/SmallSpinner";
import { Congrats } from "../modals/Congrats";

const PaymentBundlesForm = ({ id, gradeId, label }) => {
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
  } = useForm({
    mode: "all",

    resolver: zodResolver(unlockSchema),
    defaultValues: {
      grade_id: gradeId,
      code: "",
    },
  });

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const onSubmit = async (v) => {
    try {
      const response = await axios.post("/api?url=students/subscripe-bundle", {
        code: v.code.trim(),
        bundle_id: id,
        grade_id: gradeId,
      });
      // setOpen(true);

      toast({
        description: "      تم    دفع قيمه الكورس بنجاح",
        icon: "success",
      });
      router.push(`/bundles`);
    } catch ({ response }) {
      toast({
        description:
          // response?.data?.error?.errors?.code[0] || response.data?.error.message,
          "كود غير صحيح",
        icon: "error",
      });
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-[40px] w-full space-y-6"
      >
        <div className="flex flex-col">
          <h2 className="text-sm text-[#523412]">{label || "الكود"}</h2>
          <div className="flex w-full gap-[24px]">
            <div className="relative mt-[4px] flex-1 border-b border-[#523412] bg-white p-2">
              <input
                type="text"
                name="code"
                className="mt-[8px] w-full border-none text-sm font-medium text-[#121212] placeholder:text-[#121212] focus:outline-hidden"
                placeholder={`أدخل ${label || "الكود"}`}
                {...register("code")}
              />
              {errors.code && (
                <span className="absolute right-0 -bottom-6 text-sm text-red-700">
                  {" "}
                  {label || " من فضلك ادخل الكود"}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="bg-primary border-gray-light h-[40px] self-end rounded-[10px] border px-[24px] text-white"
              disabled={isSubmitting}
            >
              {!isSubmitting ? "إدخال" : <SmallSpinner />}
            </button>
          </div>
        </div>
        {/* <button
            type="submit"
            className="bg-[#523412] text-white rounded-[10px] py-2 font-bold w-[265px] flex justify-center mt-[56px] border border-gray-light"
            disabled={form.formState.isSubmitting}
          >
            {!form.formState.isSubmitting ? "   تأكيد" : <SmallSpinner />}
          </button> */}
      </form>
      <Congrats open={open} setOpen={setOpen} />
    </>
  );
};
export default PaymentBundlesForm;
