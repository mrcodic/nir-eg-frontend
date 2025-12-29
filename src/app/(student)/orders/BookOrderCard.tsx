import DataLabel from "@/components/custom/DataLabel";
import PaymentStatusBadge from "@/modules/payment/components/PaymentStatusBadge";
import Image from "next/image";
import CartDetailsSideSheet from "./CartDetailsSideSheet";

function BookOrderCard({ item }: { item: any }) {
  return (
    <div className="flex flex-col gap-[24px] md:flex-row">
      <div className="bg-background relative aspect-video rounded-[7.283px] max-md:mx-auto max-md:w-full max-md:max-w-[335px] md:w-[368px]">
        <img
          className="absolute inset-4 h-[calc(100%-32px)] w-[calc(100%-32px)] rounded-[7.283px] object-contain object-center"
          src={item?.model?.cover || "/assets/grade-placeholder.png"}
          onError={(e) =>
            (e.currentTarget.src = "/assets/grade-placeholder.png")
          }
        />
      </div>

      <div className={`flex-1 rounded-lg p-4`}>
        <div className="flex w-full flex-wrap items-center justify-between gap-[24px]">
          <h2 className="text-sm font-bold text-[#121212] md:text-[18px]">
            {item?.model?.name}
            <p className="text-sm text-gray-500">{item?.trasnsaction_id}</p>
          </h2>

          <h2 className="flex flex-wrap items-center gap-1 font-bold">
            حالة الدفع : <PaymentStatusBadge status={item.payment_status} />
          </h2>
        </div>

        <div className="bg-gray-light my-[12px] h-px w-full" />

        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4">
            <DataLabel text="حالة الطلب"> قيد الانتظار</DataLabel>

            {/* show only for cart */}
            <CartDetailsSideSheet item={item} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-8">
            <DataLabel text="السعر"> {item.amount} جنية</DataLabel>

            <DataLabel text="التاريخ">
              {" "}
              <div className="flex gap-[40px]">
                <span className="text-[#523412]">
                  {new Date(item?.created_at).toISOString().split("T")[0]}
                </span>
              </div>
            </DataLabel>

            <DataLabel text={"طريفة الدفع"}>
              <Image
                src={"/assets/Fawry.svg"}
                alt=""
                width={0}
                height={0}
                className="size-auto object-contain"
              />
              {/* {paymentTypesObj[item?.payment_method || ""]?.icons?.map(
                    (icon) => (
                      <Image
                        src={icon}
                        alt=""
                        width={0}
                        height={0}
                        className=" object-contain size-auto"
                      />
                    )
                  )} */}
            </DataLabel>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookOrderCard;
