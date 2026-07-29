import DataLabel from "@/components/custom/DataLabel";
import CustomImage from "@/components/ui/CustomImage";
import { paymentTypesObj } from "@/constants";
import { formatCurrency } from "@/lib/utils";
import PaymentStatusBadge from "@/modules/payment/components/PaymentStatusBadge";
import PriceBadge from "@/modules/payment/components/PriceBadge";
import { CourseOrder } from "@/types";
import Image from "next/image";

function CourseOrderCard({ courseOrder }: { courseOrder: CourseOrder }) {
  return (
    <div className="flex flex-col gap-x-6 gap-y-4 md:flex-row">
      <div className="border-gray-light bg-background relative aspect-square rounded-lg border max-md:mx-auto max-md:h-[200px] max-md:w-full max-md:max-w-full md:w-[200px]">
        <CustomImage
          className="absolute inset-4 rounded-lg object-cover object-center"
          src={courseOrder?.model?.cover}
          fallback={"/assets/grade-placeholder.png"}
          alt="course cover"
          fill
          fetchPriority="high"
          loading="eager"
        />
      </div>

      <div className={`border-gray-light flex-1 rounded-lg border p-4`}>
        <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <h2 className="text-sm font-bold text-black md:text-lg">
            {courseOrder.model?.name}
            <p className="text-sm text-gray-500">
              {courseOrder.trasnsaction_id}
            </p>
          </h2>

          <PaymentStatusBadge
            status={courseOrder?.payment_status}
            className="ms-auto"
          />
        </div>

        <div className="bg-gray-light my-3 h-px w-full" />

        {courseOrder.model_type === "Bundle" && (
          <div className="border-gray-light flex flex-col gap-1 border-b pb-3">
            <span className="text-gray-dark inline-block text-sm">
              تحتوي الباقة على الكورسات التالية:
            </span>

            <span className="inline-block font-bold">
              {courseOrder.model?.courses.map((name, index, arr) => (
                <span key={name}>
                  <span className="text-sm">{name} </span>
                  {index < arr.length - 1 && (
                    <span className="text-gray-dark px-1 text-xs">و</span>
                  )}
                </span>
              ))}
            </span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2">
          <DataLabel text="السعر">
            {formatCurrency(courseOrder?.amount)}
          </DataLabel>

          <DataLabel text="التاريخ">
            {" "}
            <div className="flex gap-4">
              <span className="text-[#523412]">
                {new Date(courseOrder.created_at).toISOString().split("T")[0]}
              </span>
            </div>
          </DataLabel>

          <DataLabel text={"طريفة الدفع"}>
            {courseOrder.payment_method === "FREE" ? (
              <PriceBadge price={0} className="text-sm" />
            ) : (
              paymentTypesObj[courseOrder.payment_method || ""]?.icons?.map(
                (icon) => (
                  <Image
                    key={icon}
                    src={icon}
                    alt=""
                    width={0}
                    height={0}
                    className="size-auto object-contain"
                  />
                ),
              )
            )}
          </DataLabel>
        </div>
      </div>
    </div>
  );
}

export default CourseOrderCard;
