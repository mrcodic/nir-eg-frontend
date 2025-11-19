import BooksStoreItems from "@/modules/books-store/components/BooksStoreItems";
import PaymentNotifStatus from "@/modules/books-store/components/PaymentNotifStatus";

import { Book } from "@/types/books.types";
import { getGuestData } from "@/utils/clientFun";
import BookDetailsCard from "./BookDetailsCard";

async function page({ params }: { params: Promise<{ bookId: string }> }) {
  const bookId = (await params).bookId;
  const book = await getGuestData<{ data: Book }>({
    queryKey: ["books/" + bookId],
  });

  console.log("book details : ", book);

  return (
    <div className="section--style">
      <h1 className="font-bold text-[28px]">{book?.data?.name}</h1>

      {/* <PaymentResultClient /> */}
      <PaymentNotifStatus currentPath={`/books/${bookId}`} />

      <BookDetailsCard book={book?.data} />

      <BooksStoreItems title="منتجات مشابهة" className="mt-24" />
    </div>
  );
}

export default page;
