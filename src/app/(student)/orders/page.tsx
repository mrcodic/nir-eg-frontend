import { Tabs, TabsContent } from "@/components/ui/tabs";
import TransactionsList from "./TransactionsList";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ orderType?: string }>;
}) {
  const { orderType = "courses" } = await searchParams;

  return (
    <div className="wrapper my-[140px] space-y-6">
      <h2 className="text-2xl font-bold">الطلبات </h2>

      <Tabs defaultValue={orderType} className="space-y-6">
        <TabsContent value="courses">
          <TransactionsList type="course" />
        </TabsContent>

        <TabsContent value="books">
          <TransactionsList type="cart" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
