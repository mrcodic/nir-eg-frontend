import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <TabsList className="w-full gap-6">
          <TabsTrigger
            value="books"
            className="data-[state=active]:bg-primary-800 border-gray-light h-11 rounded-[10px] border p-2 px-3 font-bold data-[state=active]:text-white"
          >
            طلبات الكتب
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="data-[state=active]:bg-primary-800 border-gray-light h-11 rounded-[10px] border p-2 px-3 font-bold data-[state=active]:text-white"
          >
            طلبات الكورسات
          </TabsTrigger>
        </TabsList>

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
