"use client";
import { useToast } from "@/hooks/use-toast";
import { unlockSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CustomLoader from "../custom/Loader";
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
      router.push(`/bundles?grade=${gradeId}`);
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
        className="mt-[40px] w-full space-y-6 "
      >
        <div className="flex flex-col">
          <h2 className="text-[#523412] text-sm">{label || "الكود"}</h2>
          <div className="flex w-full gap-[24px]">
            <div className="bg-white flex-1 relative  border-[#523412] border-b p-2 mt-[4px]">
              <input
                type="text"
                name="code"
                className="w-full mt-[8px] text-[#121212] font-medium text-sm border-none focus:outline-hidden placeholder:text-[#121212]"
                placeholder={`أدخل ${label || "الكود"}`}
                {...register("code")}
              />
              {errors.code && (
                <span className="text-red-700 text-sm absolute -bottom-6 right-0">
                  {" "}
                  {label || " من فضلك ادخل الكود"}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="bg-primary rounded-[10px] self-end border border-gray-light px-[24px] text-white h-[40px]"
              disabled={isSubmitting}
            >
              {!isSubmitting ? "إدخال" : <CustomLoader />}
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
      <Congrats open={open} setOpen={setOpen} />
    </>
  );
};
export default PaymentBundlesForm;
