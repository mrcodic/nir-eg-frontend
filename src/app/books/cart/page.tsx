import BooksStoreItems from "@/modules/books-store/components/BooksStoreItems";
import CartContent from "@/modules/books-store/components/CartContent";
import { getData } from "@/utils/api";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Books Cart",
};

async function page() {
  const profile = await getData({ queryKey: [`/students/profile`] });

  if (!profile) {
    redirect("/login?redirect=/books/cart");
  }

  return (
    <div className="section--style space-y-24">
      <CartContent />
      <BooksStoreItems perPage={6} title="منتجات مشابهة" />
    </div>
  );
}

export default page;
