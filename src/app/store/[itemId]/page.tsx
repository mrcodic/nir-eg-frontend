import { getServerData } from "@/helpers/fetchers/server-fetch";
import StoreItemDetailsCard from "@/modules/store/components/StoreItemDetailsCard";
import StoreItems from "@/modules/store/components/StoreItems";
import { StoreItem } from "@/types/store.types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تفاصيل المنتج",
  description: "اطلع على تفاصيل المنتج ومواصفاته وخيارات الشراء أو الطلب.",
};

async function page({ params }: { params: Promise<{ itemId: string }> }) {
  const itemId = (await params).itemId;
  const book = await getServerData<{ data: StoreItem }>({
    queryKey: ["books/" + itemId],
  });

  return (
    <div className="section--style">
      <StoreItemDetailsCard book={book?.data} />

      <StoreItems
        title="منتجات مشابهة"
        className="border-gray-light mt-12 border-t pt-12"
      />
    </div>
  );
}

export default page;
