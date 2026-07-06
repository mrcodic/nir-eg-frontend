import StoreItems from "@/modules/store/components/StoreItems";
import { getTenantSettingsServer } from "@/services/tenant.service";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "متجر المنتجات",
  description: "تصفح المنتجات المتاحة وخيارات الشراء المرتبطة بها.",
};

async function page() {
  const tenantSettings = await getTenantSettingsServer();

  if (!tenantSettings?.features?.book_store) {
    return redirect("/bundles");
  }

  // const booksSettings = await getServerData<{ data: BookLinksSettings }>({
  //   queryKey: ["settings/books"],
  // });

  return (
    <div className="section--style">
      <StoreItems />

      {/* <BooksStores links={booksSettings?.data?.links ?? []} /> */}
    </div>
  );
}

export default page;
