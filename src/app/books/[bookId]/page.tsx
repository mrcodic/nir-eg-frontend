import BooksStoreItems from "@/modules/books-store/components/BooksStoreItems";

import { getClientData } from "@/helpers/client-fetch";
import { Book } from "@/types/books.types";
import BookDetailsCard from "./BookDetailsCard";

async function page({ params }: { params: Promise<{ bookId: string }> }) {
  const bookId = (await params).bookId;
  const book = await getClientData<{ data: Book }>({
    queryKey: ["books/" + bookId],
  });

  console.log("book details : ", book);

  return (
    <div className="section--style">
      <h1 className="text-28 font-bold">{book?.data?.name}</h1>

      <BookDetailsCard book={book?.data} />

      <BooksStoreItems title="منتجات مشابهة" className="mt-24" />
    </div>
  );
}

export default page;
