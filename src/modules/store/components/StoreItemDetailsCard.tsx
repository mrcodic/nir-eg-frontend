"use client";

import { StorePaymentModel } from "@/components/modals/StorePaymentModel";
import CustomImage from "@/components/ui/CustomImage";
import { useModal } from "@/context/ModalProvider";
import { formatCurrency } from "@/lib/utils";
import BuyStoreItemTrigger from "@/modules/store/components/BuyStoreItemTrigger";
import OutOfStockBadge from "@/modules/store/components/OutOfStockBadge";
import StoreItemCartAddRemove from "@/modules/store/components/StoreItemCartAddRemove";
import StoreItemQuantity from "@/modules/store/components/StoreItemQuantity";
import { StoreItem } from "@/types/store.types";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function StoreItemDetailsCard({ book }: { book: StoreItem }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modal = useModal();

  const { name, price, description, status, in_stock } = book || {};

  const outOfStock = status === 1 || !in_stock;

  useEffect(() => {
    if (searchParams.get("open_modal") == "true") {
      modal.setDialogContent(<StorePaymentModel item={book} />);
      modal.openModal();
      router.replace("/store/" + book?.id);
    }
  }, [book, modal, name, price, router, searchParams]);

  return (
    <section className="mt-8">
      <div className="flex items-center gap-6 max-md:flex-col">
        <div className="bg-background border-gray-light relative aspect-square w-full max-w-[368px] shrink-0 overflow-hidden rounded-2xl border">
          <CustomImage
            fallback="/assets/grade-placeholder.png"
            src={book?.image}
            alt="book"
            fill
            className="object-cover"
          />
          {outOfStock && <OutOfStockBadge />}
        </div>

        <div className="grow">
          <h2 className="text-28 font-bold max-md:hidden">{name}</h2>

          <p className="mt-4 text-lg font-medium md:text-xl">{description}</p>

          <hr className="border-gray-light mt-3 mb-6" />

          <div>
            <div className="flex flex-wrap items-end gap-2">
              <p className="text-2xl font-bold">
                <span className="me-4 text-xl">السعر:</span>
                {formatCurrency(price)}
              </p>
              {book?.can_buy_points && book?.points_price !== null && (
                <p className="flex items-center text-sm font-bold">
                  ({" "}
                  <span className="me-2 font-normal text-black">
                    أو بالنقاط :
                  </span>
                  <span className="text-secondary">
                    {book.points_price} نقطة
                  </span>
                  )
                </p>
              )}
            </div>

            {outOfStock ? (
              <div className="mt-6">
                <p className="text-secondary border-secondary bg-secondary-50 border-r-2 px-2 py-2 text-base font-bold">
                  هذا المنتج غير متاح للشراء في الوقت الحالي
                </p>
              </div>
            ) : (
              <div className="mt-6 flex min-h-11 flex-wrap-reverse items-center justify-between gap-4">
                <div className="flex w-fit flex-wrap gap-x-4 gap-y-2 md:gap-x-6">
                  <Suspense>
                    <BuyStoreItemTrigger
                      item={book}
                      buttonClassName="h-10 text-lg px-12 font-bold"
                    />
                  </Suspense>

                  <StoreItemCartAddRemove
                    item={book}
                    buttonClassName="h-10 text-lg px-12 font-bold"
                  />
                </div>

                <StoreItemQuantity item={book as any} className="ms-auto" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StoreItemDetailsCard;
