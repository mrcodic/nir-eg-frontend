"use client";
import { useToast } from "@/hooks/use-toast";
import { paymentType } from "@/types";
import { redirectUrl } from "@/utils/clientFun";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CustomLoader from "../custom/Loader";
import { Congrats } from "../modals/Congrats";
const WalletPay = ({ id, gradeId, label }) => {
  const searchParam = useSearchParams();
  const courseId = searchParam.get("courseId");
  const bundleId = searchParam.get("bundleId");

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
  } = useForm({
    mode: "all",

    // resolver: zodResolver(unlockSchema),
    defaultValues: {
      phone: "",
    },
  });

  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const onSubmit = async (v) => {
    try {
      const response = await axios.post("/api?url=/payment", {
        model_id: courseId || bundleId,
        model_type: courseId ? "course" : "bundle",
        payment_method: paymentType.wallet,
        success_url: redirectUrl({ bundleId, courseId })[0],
        failure_url: redirectUrl({ bundleId, courseId })[1],
        phone: v.phone,
      });

      return router.push(response.data?.payment_url);
    } catch (e) {
      console.log(e);
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
                name="phone"
                className="w-full mt-[8px] text-[#121212] font-medium text-sm border-none focus:outline-hidden placeholder:text-[#121212]"
                placeholder={`أدخل ${label || "الكود"}`}
                {...register("phone")}
              />
              {errors.phone && (
                <span className="text-red-700 text-sm absolute -bottom-6 right-0">
                  {" "}
                  {label || " من فضلك ادخل رقم الهاتف"}
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
export default WalletPay;
