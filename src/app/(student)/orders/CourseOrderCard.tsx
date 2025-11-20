import DataLabel from "@/components/custom/DataLabel";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";
import { paymentTypesObj } from "@/constants";
import Image from "next/image";

function CourseOrderCard({ data }: { data: any }) {
  return (
    <div dir="rtl" className="flex flex-col gap-4">
      {data?.map((bundle) => {
        return (
          <div className="flex flex-col md:flex-row gap-[24px]">
            <div className="max-md:w-full max-md:max-w-[335px] max-md:mx-auto md:w-[368px] aspect-video  relative bg-background rounded-[7.283px]">
              <img
                className=" inset-4 absolute object-contain object-center rounded-[7.283px] w-[calc(100%-32px)] h-[calc(100%-32px)]"
                src={bundle?.model?.cover || "/assets/grade-placeholder.png"}
                onError={(e) =>
                  (e.currentTarget.src = "/assets/grade-placeholder.png")
                }
              />
            </div>

            <div className={`flex-1  rounded-lg p-4  `}>
              <div className="flex w-full items-center justify-between gap-[24px] flex-wrap">
                <h2 className="text-[#121212] text-sm md:text-[18px] font-bold">
                  {bundle?.model?.name}
                  <p className="text-sm text-gray-500">
                    {bundle?.trasnsaction_id}
                  </p>
                </h2>

                <h2 className="flex items-center flex-wrap font-bold gap-1">
                  حالة الدفع :{" "}
                  <PaymentStatusBadge status={bundle.payment_status} />
                </h2>
              </div>
              <div className="h-px w-full bg-primary-700 my-[12px]" />
              {/* <div className="flex text-sm md:text-[16px] gap-1  md:gap-[8px]">
                          <span className="text-gray-dark inline-block">
                            تحتوى على
                          </span>

                          <span className="text-[#523412] inline-block font-bold">
                            {bundle?.model?.courses?.join(" و ")}
                          </span>
                        </div> */}
              <div className="flex flex-wrap gap-8 items-center mt-4">
                <DataLabel text="السعر"> {bundle.amount} جنية</DataLabel>

                <DataLabel text="التاريخ">
                  {" "}
                  <div className=" flex gap-[40px]">
                    <span className="text-[#523412] ">
                      {new Date(bundle?.created_at).toISOString().split("T")[0]}
                    </span>
                  </div>
                </DataLabel>

                <DataLabel text={"طريفة الدفع"}>
                  {paymentTypesObj[bundle?.payment_method || ""]?.icons?.map(
                    (icon) => (
                      <Image
                        src={icon}
                        alt=""
                        width={0}
                        height={0}
                        className=" object-contain size-auto"
                      />
                    )
                  )}
                </DataLabel>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CourseOrderCard;
