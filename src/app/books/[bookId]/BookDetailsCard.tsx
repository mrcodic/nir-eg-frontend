"use client";

import { BookPaymentModel } from "@/components/modals/BookPaymentModel";
import { useModal } from "@/context/ModalProvider";
import { formatCurrency } from "@/lib/utils";
import BookCartAddRemove from "@/modules/books-store/components/BookCartAddRemove";
import BookQuantity from "@/modules/books-store/components/BookQuantity";
import BuyBookTrigger from "@/modules/books-store/components/BuyBookTrigger";
import OutOfStockBadge from "@/modules/books-store/components/OutOfStockBadge";
import { Book } from "@/types/books.types";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function BookDetailsCard({ book }: { book: Book }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modal = useModal();

  const { name, price, description, status } = book || {};

  useEffect(() => {
    if (searchParams.get("bookId") == book?.id) {
      modal.setDialogContent(
        <BookPaymentModel bookId={book?.id} price={Number(price)} name={name} />
      );
      modal.openModal();
      router.push("/books/" + book?.id);
    }
  }, [searchParams]);

  return (
    <section className="mt-8">
      <div className="flex gap-6 items-center max-md:flex-col ">
        <div className="relative aspect-square max-w-[368px] shrink-0 w-full rounded-2xl bg-background">
          <Image
            src="/assets/book.svg"
            alt="book"
            fill
            className="object-contain absolute inset-2! w-[calc(100%-16px)]! h-[calc(100%-16px)]! rounded-lg"
          />
          {status === 1 && <OutOfStockBadge />}
        </div>

        <div className="grow">
          <h2 className="font-bold text-[28px] max-md:hidden">{name}</h2>

          <p className="md:text-xl text-lg font-medium mt-4">{description}</p>

          <hr className="border-primary-700 mt-3 mb-6" />

          <div>
            <p className="text-2xl font-bold">
              <span className="text-xl me-4">السعر:</span>
              {formatCurrency(price)}
            </p>

            <div className="flex justify-between gap-4 items-center mt-6 flex-wrap-reverse min-h-11">
              <div className="flex gap-x-4 md:gap-x-6 gap-y-2 w-fit flex-wrap">
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

export default BookDetailsCard;
