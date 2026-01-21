"use client";
import { useToast } from "@/hooks/use-toast";
import PaymentWhatsappLink from "@/modules/payment/components/PaymentWhatsappLink";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SmallSpinner from "../custom/SmallSpinner";
import Empty from "../Empty";
import { Congrats } from "../modals/Congrats";

const PaymentCenterCode = ({ courseId, data, roomId }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
  } = useForm({
    mode: "all",
    // resolver: zodResolver(unlockRoomSchema),
    defaultValues: {
      course_id: courseId,
      room_id: roomId,
      code: "",
    },
  });

  const onSubmit = async (v) => {
    try {
      const response = await axios.post(
        "/api?url=students/subscriptions/claim-coupon",
        {
          code: v.code.trim(),
          classroom_id: courseId,
          room_id: roomId,
        },
      );

      console.log("success response : ", response);

      toast({
        description: "تم دفع قيمه الكورس بنجاح 🎉",
        icon: "success",
      });

      router.push(`/bundles/${courseId}`);
    } catch (e) {
      console.log("error response : ", e);
      toast({
        description:
          e?.response?.data?.error?.errors?.code[0] ||
          e?.response?.data?.error.message ||
          "كود غير صحيح",
        icon: "error",
      });
    }
  };

  if (!data)
    return (
      <div className="h-screen">
        <Empty text={"لا يوجد بيانات "} />
      </div>
    );

  return (
    <div className="mt-10 w-full">
      <div className="flex flex-col items-center gap-6 md:flex-row">
        <div className="relative hidden aspect-square h-48 overflow-hidden rounded-xl md:block">
          <Image
            className=""
            src={data?.thumbnail || "/assets/grade-placeholder.png"}
            fill
            alt=""
          />
        </div>
        <div
          style={{
            boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
          }}
          className={`min-h-48 w-full flex-1 rounded-lg border border-[#1EAD7B] p-4`}
        >
          <div className="flex w-full justify-between gap-6">
            <h2 className="text-[18px] font-bold text-[#121212]">
              {data?.title}
            </h2>
            {!data?.sale?.id && data?.price && (
              <div className="w-[111px] rounded-lg bg-[#523412] px-2 py-0.5 text-center text-[18px] text-white">
                {data?.price} جنيه
              </div>
            )}
            {data?.sale?.id && (
              <div className="flex gap-6">
                <div className="bg-gray-dark rounded-lg px-2 py-0.5 font-bold text-white line-through">
                  {data?.price} جنيه
                </div>
                <div className="w-[111px] rounded-lg bg-[#1EAD7B] px-2 py-0.5 text-center font-bold text-white">
                  {data?.sale?.discount_type === 0
                    ? ((100 - data?.sale?.discount_value) / 100) * data?.price
                    : data?.price - data?.sale?.discount_value}{" "}
                  جنيه
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-light my-3 h-px w-full" />
          <div className="flex gap-2 text-[16px] font-bold">
            <span className="text-gray-dark inline-block text-sm">
              {" "}
              {data?.description}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between">
            <div className="mt-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <img className="h-[16px] w-[16px]" src="/assets/create.svg" />
                <span className="text-[10px] text-[#523412]">
                  {data?.created_at?.split(" ")?.[0]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <img className="h-[16px] w-[16px]" src={"/assets/Update.svg"} />
                <span className="text-[10px] text-[#523412]">
                  {data?.updated_at?.split(" ")?.[0]}{" "}
                </span>
              </div>
            </div>

            {data?.sale && (
              <div>
                <div className="flex items-center gap-1">
                  <h2 className="text-sm font-bold text-[#121212]">
                    احصل على خصم
                  </h2>
                  <div className="mr-2 flex size-8 items-center justify-center bg-[url(/assets/sale?.svg)]">
                    <div className="flex items-center justify-center text-center">
                      <div className="re flex size-12 items-center justify-center bg-[url(/assets/Sale.svg)] bg-cover">
                        <div className="flex items-center justify-center text-center">
                          <span
                            style={{
                              textShadow:
                                "2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000",
                            }}
                            className="mt-0.5 inline-block text-center text-sm text-white"
                          >
                            {data?.sale?.discount_type === 0
                              ? data?.sale?.discount_value + "%"
                              : data?.sale?.discount_value + "جنيه"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-dark text-[12px]">متاح لمدة</span>
                  <span className="font-bold text-[#B75050] underline">
                    {data?.sale?.duration}
                    أيام
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
        }}
        className="border-primary mt-14 rounded-lg border px-10 py-8 md:px-10"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <h2 className="text-sm text-[#523412]">الكود</h2>
            <div className="flex w-full gap-6">
              <div className="relative mt-1 flex-1 border-b border-[#523412] bg-white p-2">
                <input
                  type="text"
                  name="code"
                  className="mt-2 w-full border-none text-sm font-medium text-[#121212] placeholder:text-[#121212] focus:outline-hidden"
                  placeholder="أدخل الكود"
                  {...register("code")}
                />
                {errors.code && (
                  <span className="absolute right-0 -bottom-6 text-sm text-red-700">
                    {" "}
                    من فضلك ادخل الكود
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="bg-primary border-gray-light h-10 self-end rounded-[10px] border px-6 text-white"
                disabled={isSubmitting}
              >
                {!isSubmitting ? "إدخال" : <SmallSpinner />}
              </button>
            </div>
          </div>
        </form>

        {open && <Congrats open={open} setOpen={setOpen} />}
      </div>

      <h3 className="mt-4 text-sm md:text-lg">
        أدخل الكود لتتمكن من عرض محتوى الكورس , للحصول علي الكود من خلال السنتر.
      </h3>

      <PaymentWhatsappLink className="mt-4" />
    </div>
  );
};
export default PaymentCenterCode;
