import DataLabel from "@/components/custom/DataLabel";
import CustomImage from "@/components/ui/CustomImage";
import { deliveryStatusArabic } from "@/constants";
import { cn, formatCurrency } from "@/lib/utils";
import PaymentStatusBadge from "@/modules/payment/components/PaymentStatusBadge";
import { StoreOrder } from "@/types";
import Image from "next/image";
import Link from "next/link";
import CartDetailsSideSheet from "./CartDetailsSideSheet";

const imgWrapperClassname =
  "border-gray-light bg-background relative aspect-square rounded-lg border max-md:mx-auto max-md:h-[200px] max-md:w-full max-md:max-w-full md:w-[200px] overflow-hidden";

function StoreOrderCard({ storeOrder }: { storeOrder: StoreOrder }) {
  const isCart = storeOrder.type === "cart" || storeOrder?.items?.length > 1;

  const itemImage = (
    <CustomImage
      className="absolute inset-4 rounded-lg object-cover object-center transition-all duration-300"
      src={storeOrder?.items[0]?.book_image}
      fallback={"/assets/grade-placeholder.png"}
      alt="item image"
      fill
    />
  );

  const usedPoints = storeOrder.payment_method_key === "points";

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {isCart ? (
        <div className={imgWrapperClassname}>{itemImage}</div>
      ) : (
        <Link
          href={`/store/${storeOrder?.items?.[0]?.book_id}`}
          className={cn(
            imgWrapperClassname,
            "hover:[&>img]:scale-110 hover:[&>img]:opacity-80",
          )}
        >
          {itemImage}
        </Link>
      )}

      <div className={`border-gray-light flex-1 rounded-lg border p-4`}>
        <div className="flex w-full flex-wrap items-center justify-between gap-6">
          <h2 className="text-sm font-bold text-black md:text-lg">
            {isCart ? "تفاصيل الطلب" : storeOrder?.items?.[0]?.book_name}
            <p className="text-sm text-gray-500">{storeOrder?.order_number}</p>
          </h2>

          <PaymentStatusBadge status={storeOrder.status} variant="book" />
        </div>

        <div className="bg-gray-light my-3 h-px w-full" />

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-sm">
              حالة التوصيل:{" "}
              <span className="ps-2 font-bold">
                {deliveryStatusArabic[storeOrder?.delivery_status] ||
                  "قيد الانتظار"}
              </span>
            </h3>

            {/* show only for cart */}
            {isCart && <CartDetailsSideSheet storeOrder={storeOrder} />}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-8">
            <DataLabel text="السعر">
              {usedPoints
                ? `${storeOrder?.points_total || 0} نقطة`
                : formatCurrency(storeOrder.total_price)}
            </DataLabel>

            {!isCart && (
              <DataLabel text="الكمية">
                {storeOrder.items[0]?.quantity}
              </DataLabel>
            )}

            <DataLabel text="التاريخ">
              <div className="flex gap-10">
                <span className="text-[#523412]">
                  {new Date(storeOrder?.created_at).toISOString().split("T")[0]}
                </span>
              </div>
            </DataLabel>

            <DataLabel text={"طريقة الدفع"}>
              {usedPoints ? (
                <span className="bg-secondary-50 text-secondary flex items-center gap-2 rounded-lg px-2 py-1 font-bold">
                  <Image
                    src="/assets/star-colored.svg"
                    alt="star icon"
                    width={16}
                    height={16}
                    className="size-4 object-contain"
                  />
                  نقاط
                </span>
              ) : (
                <Image
                  src={"/assets/Fawry.svg"}
                  alt=""
                  width={80}
                  height={32}
                  className="size-auto object-contain"
                />
              )}
            </DataLabel>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreOrderCard;
