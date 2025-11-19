import BooksStoreItems from "@/modules/books-store/components/BooksStoreItems";
import BooksStores from "@/modules/books-store/components/BooksStores";
import PaymentNotifStatus from "@/modules/books-store/components/PaymentNotifStatus";
import { BookLinksSettings } from "@/types/books.types";
import { getGuestData } from "@/utils/clientFun";

async function page({
  searchParams,
}: {
  searchParams: Promise<{ bookId: string }>;
}) {
  const booksSettings = await getGuestData<{ data: BookLinksSettings }>({
    queryKey: ["settings/books"],
  });

  return (
    <div className="section--style">
      <PaymentNotifStatus currentPath={`/books`} />

      {!booksSettings?.data?.hide_books && <BooksStoreItems />}

      <BooksStores links={booksSettings?.data?.links ?? []} />
    </div>
  );
}

export default page;
