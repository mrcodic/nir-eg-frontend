"use client";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CustomLoader from "../custom/Loader";
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
        }
      );

      console.log("success response : ", response);

      toast({
        description: "      تم    دفع قيمه الكورس بنجاح",
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

  console.log(data);

  if (!data)
    return (
      <div className="h-screen">
        <Empty text={"لا يوجد بيانات "} />
      </div>
    );

  return (
    <div className="mt-[40px] w-full">
      <div className="flex flex-col items-center md:flex-row gap-[24px]">
        <img
          className="md:w-[156px] md:max-w-1/3 w-full hidden md:block  "
          src={data?.thumbnail || "/assets/grade-placeholder.png"}
        />
        <div
          style={{
            boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
          }}
          className={`flex-1 border border-[#1EAD7B] rounded-lg p-4 `}
        >
          <div className="flex w-full justify-between gap-[24px]">
            <h2 className="text-[#121212] text-[18px] font-bold">
              {data?.title}
            </h2>
            {!data?.sale?.id && data?.price && (
              <div className="bg-[#523412] text-center w-[111px] py-[2px] px-[8px] text-[18px] rounded-lg text-white">
                {data?.price} جنيه
              </div>
            )}
            {data?.sale?.id && (
              <div className="flex gap-[24px]">
                <div className="bg-gray-dark font-bold text-white py-[2px] px-[8px] line-through rounded-lg">
                  {data?.price} جنيه
                </div>
                <div className="bg-[#1EAD7B] w-[111px] text-center font-bold text-white py-[2px] px-[8px]  rounded-lg">
                  {data?.sale?.discount_type === 0
                    ? ((100 - data?.sale?.discount_value) / 100) * data?.price
                    : data?.price - data?.sale?.discount_value}{" "}
                  جنيه
                </div>
              </div>
            )}
          </div>

          <div className="h-px w-full bg-primary-700 my-[12px]" />
          <div className="flex font-bold text-[16px]  gap-[8px]">
            <span className="text-gray-dark inline-block text-sm">
              {" "}
              {data?.description}
            </span>
          </div>

          <div className="flex flex-wrap mt-[24px] justify-between items-center">
            <div className="mt-[16px] flex-col flex gap-[10px]">
              <div className="flex gap-2 items-center">
                <img className="w-[16px] h-[16px]" src="/assets/create.svg" />
                <span className="text-[#523412] text-[10px]">
                  {data?.created_at?.split(" ")?.[0]}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <img className="w-[16px] h-[16px]" src={"/assets/Update.svg"} />
                <span className="text-[#523412] text-[10px]">
                  {data?.updated_at?.split(" ")?.[0]}{" "}
                </span>
              </div>
            </div>

            {data?.sale && (
              <div>
                <div className="flex gap-1 items-center">
                  <h2 className="text-[#121212]  text-sm font-bold">
                    احصل على خصم
                  </h2>
                  <div className="bg-[url(/assets/sale?.svg)]  mr-2 flex items-center justify-center w-[32px] h-[32px]">
                    <div className="text-center flex items-center justify-center">
                      <div className="bg-[url(/assets/Sale.svg)] re bg-cover flex items-center justify-center w-[48px] h-[48px]">
                        <div className="text-center flex items-center justify-center">
                          <span
                            style={{
                              textShadow:
                                "2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000",
                            }}
                            className="mt-[2px] inline-block text-white text-center text-sm"
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
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[12px] text-gray-dark">متاح لمدة</span>
                  <span className="text-[#B75050] font-bold underline">
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
        className="mt-[56px] rounded-lg border py-[32px] px-10 md:px-[40px] border-primary"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-[40px] w-full space-y-6 "
        >
          <div className="flex flex-col">
            <h2 className="text-[#523412] text-sm">الكود</h2>
            <div className="flex w-full gap-[24px]">
              <div className="bg-white flex-1 relative  border-[#523412] border-b p-2 mt-[4px]">
                <input
                  type="text"
                  name="code"
                  className="w-full mt-[8px] text-[#121212] font-medium text-sm border-none focus:outline-hidden placeholder:text-[#121212]"
                  placeholder="أدخل الكود"
                  {...register("code")}
                />
                {errors.code && (
                  <span className="text-red-700 text-sm absolute -bottom-6 right-0">
                    {" "}
                    من فضلك ادخل الكود
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="bg-primary rounded-[10px] self-end border border-primary-700 px-[24px] text-white h-[40px]"
                disabled={isSubmitting}
              >
                {!isSubmitting ? "إدخال" : <CustomLoader />}
              </button>
            </div>
          </div>
        </form>
        <Congrats open={open} setOpen={setOpen} />
      </div>

      <h3 className="mt-[16px] text-[18px]">
        أدخل الكود لتتمكن من عرض محتوى الكورس , للحصول علي الكود من خلال السنتر.
      </h3>
    </div>
  );
};
export default PaymentCenterCode;
