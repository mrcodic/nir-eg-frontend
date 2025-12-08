import DataLabel from "@/components/custom/DataLabel";
import CustomImage from "@/components/ui/CustomImage";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";
import PriceBadge from "@/components/ui/PriceBadge";
import { paymentTypesObj } from "@/constants";
import { CourseOrder } from "@/types";
import Image from "next/image";

function CourseOrderCard({ item }: { item: CourseOrder }) {
  return (
    <div className="flex flex-col md:flex-row gap-x-6 gap-y-4">
      <div className="max-md:w-full max-md:max-w-full max-md:h-[200px] max-md:mx-auto md:w-[200px] aspect-square border border-gray-light relative bg-background rounded-lg">
        <CustomImage
          className=" inset-4 absolute object-contain object-center rounded-lg"
          src={item?.model?.cover}
          fallback={"/assets/grade-placeholder.png"}
          alt="course cover"
          fill
        />
      </div>

      <div className={`flex-1  rounded-lg p-4 border border-gray-light `}>
        <div className="flex w-full items-center justify-between gap-6 flex-wrap">
          <h2 className="text-[#121212] text-sm md:text-xl font-bold">
            {item?.model?.name}
            <p className="text-sm text-gray-500">{item?.trasnsaction_id}</p>
          </h2>

          <PaymentStatusBadge status={item.payment_status} />
        </div>

        <div className="h-px w-full bg-gray-light my-[12px]" />

        {item?.model_type === "Bundle" && (
          <div className="flex gap-1  flex-col border-b pb-3 border-gray-light">
            <span className="text-gray-dark inline-block text-sm">
              تحتوي الباقة على التالي:
            </span>

            <span className="inline-block font-bold text-base">
              {item?.model?.courses?.join(" و ")}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-8 items-center mt-4">
          <DataLabel text="السعر"> {item.amount} جنية</DataLabel>

          <DataLabel text="التاريخ">
            {" "}
            <div className=" flex gap-[40px]">
              <span className="text-[#523412] ">
                {new Date(item?.created_at).toISOString().split("T")[0]}
              </span>
            </div>
          </DataLabel>

          <DataLabel text={"طريفة الدفع"}>
            {item?.payment_method === "FREE" ? (
              <PriceBadge price={0} className="text-sm" />
            ) : (
              paymentTypesObj[item?.payment_method || ""]?.icons?.map(
                (icon) => (
                  <Image
                    key={icon}
                    src={icon}
                    alt=""
                    width={0}
                    height={0}
                    className=" object-contain size-auto"
                  />
                )
              )
            )}
          </DataLabel>
        </div>
      </div>
    </div>
  );
}

export default CourseOrderCard;
