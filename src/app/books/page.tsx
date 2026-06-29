import { getServerData } from "@/helpers/fetchers/server-fetch";
import BooksStoreItems from "@/modules/books-store/components/BooksStoreItems";
import BooksStores from "@/modules/books-store/components/BooksStores";
import { getTenantSettingsServer } from "@/services/tenant.service";
import { BookLinksSettings } from "@/types/books.types";
import { redirect } from "next/navigation";

async function page() {
  const tenantSettings = await getTenantSettingsServer();

  if (!tenantSettings?.features?.book_store) {
    return redirect("/");
  }

  const booksSettings = await getServerData<{ data: BookLinksSettings }>({
    queryKey: ["settings/books"],
  });

  return (
    <div className="section--style">
      {!booksSettings?.data?.hide_books && <BooksStoreItems />}

      <BooksStores links={booksSettings?.data?.links ?? []} />
    </div>
  );
}

export default page;
