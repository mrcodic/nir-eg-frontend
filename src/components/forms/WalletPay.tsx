"use client";

import { mutateClient } from "@/helpers/fetchers/post-client";
import { paymentType } from "@/types";
import { redirectUrl } from "@/utils/clientFun";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SmallSpinner from "../custom/SmallSpinner";
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
    defaultValues: {
      phone: "",
    },
  });

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onSubmit = async (v) => {
    try {
      const response = await mutateClient("/payment", {
        body: {
          model_id: courseId || bundleId,
          model_type: courseId ? "course" : "bundle",
          payment_method: paymentType.wallet,
          success_url: redirectUrl({ bundleId, courseId })[0],
          failure_url: redirectUrl({ bundleId, courseId })[1],
          phone: v.phone,
        },
      });

      return router.push(response?.payment_url);
    } catch (e) {
      console.log(e);
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
                name="phone"
                className="mt-[8px] w-full border-none text-sm font-medium text-black placeholder:text-black focus:outline-hidden"
                placeholder={`أدخل ${label || "الكود"}`}
                {...register("phone")}
              />
              {errors.phone && (
                <span className="absolute right-0 -bottom-6 text-sm text-red-700">
                  {" "}
                  {label || " من فضلك ادخل رقم الهاتف"}
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
export default WalletPay;
