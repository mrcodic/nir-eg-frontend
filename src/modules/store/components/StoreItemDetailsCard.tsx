"use client";

import { StorePaymentModel } from "@/components/modals/StorePaymentModel";
import CustomImage from "@/components/ui/CustomImage";
import { useModal } from "@/context/ModalProvider";
import { formatCurrency } from "@/lib/utils";
import BookCartAddRemove from "@/modules/store/components/BookCartAddRemove";
import BookQuantity from "@/modules/store/components/BookQuantity";
import BuyBookTrigger from "@/modules/store/components/BuyBookTrigger";
import OutOfStockBadge from "@/modules/store/components/OutOfStockBadge";
import { Book } from "@/types/books.types";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function StoreItemDetailsCard({ book }: { book: Book }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modal = useModal();

  const { name, price, description, status } = book || {};

  useEffect(() => {
    if (searchParams.get("open_modal") == "true") {
      modal.setDialogContent(
        <StorePaymentModel
          itemId={book?.id}
          price={Number(price)}
          name={name}
        />,
      );
      modal.openModal();
      router.replace("/store/" + book?.id);
    }
  }, [book?.id, modal, name, price, router, searchParams]);

  console.log(book);

  return (
    <section className="mt-8">
      <div className="flex items-center gap-6 max-md:flex-col">
        <div className="bg-background border-gray-light relative aspect-square w-full max-w-[368px] shrink-0 overflow-hidden rounded-2xl border">
          <CustomImage
            fallback="/assets/book.svg"
            src={book?.image}
            alt="book"
            fill
            className="object-cover"
          />
          {status === 1 && <OutOfStockBadge />}
        </div>

        <div className="grow">
          <h2 className="text-28 font-bold max-md:hidden">{name}</h2>

          <p className="mt-4 text-lg font-medium md:text-xl">{description}</p>

          <hr className="border-gray-light mt-3 mb-6" />

          <div>
            <p className="text-2xl font-bold">
              <span className="me-4 text-xl">السعر:</span>
              {formatCurrency(price)}
            </p>

            <div className="mt-6 flex min-h-11 flex-wrap-reverse items-center justify-between gap-4">
              <div className="flex w-fit flex-wrap gap-x-4 gap-y-2 md:gap-x-6">
                <Suspense>
                  <BuyBookTrigger
                    id={book?.id}
                    price={Number(book?.price)}
                    name={book?.name}
                    buttonClassName="h-10 text-lg px-12 font-bold"
                  />
                </Suspense>

                <BookCartAddRemove
                  book={book}
                  buttonClassName="h-10 text-lg px-12 font-bold"
                />
              </div>

              <BookQuantity book={book} className="ms-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StoreItemDetailsCard;
