import BooksStoreItems from "@/modules/books-store/components/BooksStoreItems";
import PaymentNotifStatus from "@/modules/books-store/components/PaymentNotifStatus";

import { getPublicData } from "@/helpers/client-fetch";
import { Book } from "@/types/books.types";
import BookDetailsCard from "./BookDetailsCard";

async function page({ params }: { params: Promise<{ bookId: string }> }) {
  const bookId = (await params).bookId;
  const book = await getPublicData<{ data: Book }>({
    queryKey: ["books/" + bookId],
  });

  console.log("book details : ", book);

  return (
    <div className="section--style">
      <h1 className="text-[28px] font-bold">{book?.data?.name}</h1>

      {/* <PaymentResultClient /> */}
      <PaymentNotifStatus currentPath={`/books/${bookId}`} />

      <BookDetailsCard book={book?.data} />

      <BooksStoreItems title="منتجات مشابهة" className="mt-24" />
    </div>
  );
}

export default page;
