import { getServerData } from "@/helpers/fetchers/server-fetch";
import BooksStoreItems from "@/modules/books-store/components/BooksStoreItems";
import CartContent from "@/modules/books-store/components/CartContent";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Books Cart",
};

async function page() {
  const profile = await getServerData({
    queryKey: [`/students/profile`],
  });

  if (!profile) {
    redirect("/login?redirect=/books/cart");
  }

  return (
    <div className="section--style space-y-24">
      <CartContent />

      <BooksStoreItems
        perPage={6}
        title="منتجات مشابهة"
        className="border-gray-light mt-12 border-t pt-12"
        hideOnEmptyCart={true}
      />
    </div>
  );
}

export default page;
