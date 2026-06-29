import { getServerData } from "@/helpers/fetchers/server-fetch";
import BooksStoreItems from "@/modules/books-store/components/BooksStoreItems";
import BooksStores from "@/modules/books-store/components/BooksStores";
import { getTenantSettingsServer } from "@/services/tenant.service";
import { BookLinksSettings } from "@/types/books.types";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "الكتب",
  description: "تصفح الكتب المتاحة وروابط المتاجر وخيارات الشراء المرتبطة بها.",
};

async function page() {
  const tenantSettings = await getTenantSettingsServer();

  if (!tenantSettings?.features?.book_store) {
    return redirect("/bundles");
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
