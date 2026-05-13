"use client";
import Image from "next/image";
import Empty from "../Empty";
import PriceBubbles from "../ui/price-bubble";
import CodePaymentForm from "./CodePaymentForm";

const PaymentCenterCode = ({ courseId, data, roomId }) => {
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
            className="object-cover"
            src={data?.thumbnail || "/assets/grade-placeholder.png"}
            fill
            alt=""
          />
        </div>

        <div
          className={`border-primary-800 min-h-48 w-full flex-1 rounded-lg border p-4`}
        >
          <div className="flex w-full justify-between gap-6">
            <h2 className="text-[18px] font-bold text-black">{data?.title}</h2>

            <PriceBubbles price={data?.price} sale={data?.sale} />
          </div>

          <div className="bg-gray-light my-3 h-px w-full" />

          {data?.description && (
            <p className="text-gray-dark inline-block text-sm">
              {data?.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between">
            <div className="mt-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <img className="size-4" src="/assets/time.svg" />
                <span className="text-xs text-black">
                  {data?.created_at?.split(" ")?.[0]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <img className="size-4" src={"/assets/time.svg"} />
                <span className="text-xs text-black">
                  {data?.updated_at?.split(" ")?.[0]}{" "}
                </span>
              </div>
            </div>

            {data?.sale && (
              <div>
                <div className="flex items-center gap-1">
                  <h2 className="text-sm font-bold text-black">احصل على خصم</h2>
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

      <CodePaymentForm
        roomId={roomId}
        courseId={courseId}
        isCodeCenter={true}
      />
    </div>
  );
};
export default PaymentCenterCode;
