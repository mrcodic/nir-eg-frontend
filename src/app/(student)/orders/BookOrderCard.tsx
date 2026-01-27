import DataLabel from "@/components/custom/DataLabel";
import { deliveryStatusArabic } from "@/constants";
import { BooksOrder } from "@/types";
import Image from "next/image";
import Link from "next/link";
import CartDetailsSideSheet from "./CartDetailsSideSheet";
import PaymentStatusBadge from "@/modules/payment/components/PaymentStatusBadge";

function BookOrderCard({ bookOrder }: { bookOrder: BooksOrder }) {
  const isCart = bookOrder.type === "cart";

  const bookImage = (
    <Image
      className="absolute inset-4 h-[calc(100%-32px)] w-[calc(100%-32px)] rounded-lg object-contain object-center"
      src={bookOrder?.items[0]?.book_image || "/assets/Course.svg"}
      onError={(e) => (e.currentTarget.src = "/assets/Course.svg")}
      alt="book image"
      fill
    />
  );

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {isCart ? (
        <div className="relative aspect-video rounded-[7.283px] bg-[#FBF6F0] max-md:mx-auto max-md:w-full max-md:max-w-[335px] md:w-[368px]">
          {bookImage}
        </div>
      ) : (
        <Link
          href={`/books/${bookOrder?.items?.[0]?.book_id}`}
          className="relative aspect-video rounded-[7.283px] bg-[#FBF6F0] max-md:mx-auto max-md:w-full max-md:max-w-[335px] md:w-[368px]"
        >
          {bookImage}
        </Link>
      )}

      <div className={`rounded-LG flex-1 p-4`}>
        <div className="flex w-full flex-wrap items-center justify-between gap-6">
          <h2 className="text-[14px] font-bold text-[#121212] md:text-[18px]">
            {isCart ? "عربة التسوق" : bookOrder.items[0]?.book_name}
            <p className="text-sm text-gray-500">{bookOrder?.order_number}</p>
          </h2>

          <h2 className="flex flex-wrap items-center gap-1 font-bold">
            حالة الدفع : <PaymentStatusBadge status={bookOrder.status} />
          </h2>
        </div>

        <div className="my-3 h-px w-full bg-[#D9B45C]" />

        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4">
            <h3 className="">
              حالة الطلب:{" "}
              <span className="ps-2 font-bold">
                {deliveryStatusArabic[bookOrder?.delivery_status]}
              </span>
            </h3>

            {/* show only for cart */}
            {isCart && <CartDetailsSideSheet bookOrder={bookOrder} />}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-8">
            <DataLabel text="السعر"> {bookOrder.total_price} جنية</DataLabel>
            {!isCart && (
              <DataLabel text="الكمية">
                {bookOrder.items[0]?.quantity}
              </DataLabel>
            )}

            <DataLabel text="التاريخ">
              {" "}
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
