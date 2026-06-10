import DataLabel from "@/components/custom/DataLabel";
import CustomImage from "@/components/ui/CustomImage";
import { deliveryStatusArabic } from "@/constants";
import { cn, formatCurrency } from "@/lib/utils";
import PaymentStatusBadge from "@/modules/payment/components/PaymentStatusBadge";
import { BooksOrder } from "@/types";
import Image from "next/image";
import Link from "next/link";
import CartDetailsSideSheet from "./CartDetailsSideSheet";

const imgWrapperClassname =
  "border-gray-light bg-background relative aspect-square rounded-lg border max-md:mx-auto max-md:h-[200px] max-md:w-full max-md:max-w-full md:w-[200px] overflow-hidden";

function BookOrderCard({ bookOrder }: { bookOrder: BooksOrder }) {
  const isCart = bookOrder.type === "cart" || bookOrder?.items?.length > 1;

  const bookImage = (
    <CustomImage
      className="absolute inset-4 rounded-lg object-contain object-center transition-all duration-300"
      src={bookOrder?.items[0]?.book_image}
      fallback={"/assets/grade-placeholder.png"}
      alt="book image"
      fill
    />
  );

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {isCart ? (
        <div className={imgWrapperClassname}>{bookImage}</div>
      ) : (
        <Link
          href={`/books/${bookOrder?.items?.[0]?.book_id}`}
          className={cn(
            imgWrapperClassname,
            "hover:[&>img]:scale-110 hover:[&>img]:opacity-80",
          )}
        >
          {bookImage}
        </Link>
      )}

      <div className={`border-gray-light flex-1 rounded-lg border p-4`}>
        <div className="flex w-full flex-wrap items-center justify-between gap-6">
          <h2 className="text-[14px] font-bold text-black md:text-[18px]">
            {isCart ? "عربة التسوق" : bookOrder.items[0]?.book_name}
            <p className="text-sm text-gray-500">{bookOrder?.order_number}</p>
          </h2>

          <PaymentStatusBadge
            status={bookOrder.payment_status}
            variant="book"
          />
        </div>

        <div className="bg-gray-light my-3 h-px w-full" />

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-sm">
              حالة التوصيل:{" "}
              <span className="ps-2 font-bold">
                {deliveryStatusArabic[bookOrder?.delivery_status] ||
                  "قيد الانتظار"}
              </span>
            </h3>

            {/* show only for cart */}
            {isCart && <CartDetailsSideSheet bookOrder={bookOrder} />}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-8">
            <DataLabel text="السعر">
              {formatCurrency(bookOrder.total_price)}
            </DataLabel>

            {!isCart && (
              <DataLabel text="الكمية">
                {bookOrder.items[0]?.quantity}
              </DataLabel>
            )}

            <DataLabel text="التاريخ">
              <div className="flex gap-10">
                <span className="text-[#523412]">
                  {new Date(bookOrder?.created_at).toISOString().split("T")[0]}
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
