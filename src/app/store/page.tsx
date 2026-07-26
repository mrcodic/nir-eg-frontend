import BooksStores from "@/modules/store/components/BooksStores";
import StoreItems from "@/modules/store/components/StoreItems";
import { getServerStoreSettings } from "@/services/store.service";
import { getTenantSettingsServer } from "@/services/tenant.service";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "المتجر",
  description: "تصفح المنتجات المتاحة وخيارات الشراء المرتبطة بها.",
};

async function page() {
  const [tenantSettings, storeSettings] = await Promise.all([
    getTenantSettingsServer(),
    getServerStoreSettings(),
  ]);

  if (
    !tenantSettings?.features?.book_store ||
    !storeSettings?.shouldShowStore
  ) {
    return redirect("/bundles");
  }

  return (
    <div className="section--style">
      <StoreItems />
      <BooksStores links={storeSettings?.storeData?.links ?? []} />
    </div>
  );
}

export default page;
