import { getServerData } from "@/helpers/server-fetch";
import BooksStoreItems from "@/modules/books-store/components/BooksStoreItems";
import BooksStores from "@/modules/books-store/components/BooksStores";
import PaymentNotifStatus from "@/modules/books-store/components/PaymentNotifStatus";
import { BookLinksSettings } from "@/types/books.types";

async function page() {
  const booksSettings = await getServerData<{ data: BookLinksSettings }>({
    queryKey: ["settings/books"],
  });

  console.log(booksSettings);

  return (
    <div className="section--style">
      <PaymentNotifStatus currentPath={`/books`} />

      {!booksSettings?.data?.hide_books && <BooksStoreItems />}

      <BooksStores links={booksSettings?.data?.links ?? []} />
    </div>
  );
}

export default page;
