import { getServerData } from "@/helpers/fetchers/server-fetch";
import StoreItemDetailsCard from "@/modules/store/components/StoreItemDetailsCard";
import StoreItems from "@/modules/store/components/StoreItems";
import { Book } from "@/types/books.types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تفاصيل المنتج",
  description: "اطلع على تفاصيل المنتج ومواصفاته وخيارات الشراء أو الطلب.",
};

async function page({ params }: { params: Promise<{ itemId: string }> }) {
  const itemId = (await params).itemId;
  const book = await getServerData<{ data: Book }>({
    queryKey: ["books/" + itemId],
  });

  return (
    <div className="section--style">
      <h1 className="text-28 font-bold">{book?.data?.name}</h1>

      <StoreItemDetailsCard book={book?.data} />

      <StoreItems
        title="منتجات مشابهة"
        className="border-gray-light mt-12 border-t pt-12"
      />
    </div>
  );
}

export default page;
