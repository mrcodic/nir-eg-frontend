import BooksStoreItems from "@/modules/books-store/components/BooksStoreItems";

import { getServerData } from "@/helpers/fetchers/server-fetch";
import { Book } from "@/types/books.types";
import type { Metadata } from "next";
import BookDetailsCard from "./BookDetailsCard";

export const metadata: Metadata = {
  title: "تفاصيل الكتاب",
  description: "اطلع على تفاصيل الكتاب ومواصفاته وخيارات الشراء أو الطلب.",
};

async function page({ params }: { params: Promise<{ bookId: string }> }) {
  const bookId = (await params).bookId;
  const book = await getServerData<{ data: Book }>({
    queryKey: ["books/" + bookId],
  });

  console.log("book details : ", book);

  return (
    <div className="section--style">
      <h1 className="text-28 font-bold">{book?.data?.name}</h1>

      <BookDetailsCard book={book?.data} />

      <BooksStoreItems
        title="منتجات مشابهة"
        className="border-gray-light mt-12 border-t pt-12"
      />
    </div>
  );
}

export default page;
