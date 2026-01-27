"use client";

import Empty from "@/components/Empty";
import InfiniteScroll from "@/components/InfinteScroll";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { BooksOrder, CourseOrder } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BookOrderCard from "./BookOrderCard";
import CourseOrderCard from "./CourseOrderCard";

function TransactionsList({ type = "course" }: { type: "course" | "cart" }) {
  const [data, setData] = useState<{
    body: (BooksOrder | CourseOrder)[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  } | null>(null);

  const [isLoadingData, setIsLoadingData] = useState(true);

  const isCourses = type === "course";

  const endpoint = isCourses ? "/payment/transaction" : "/students/orders";

  async function fetchData(page = 1) {
    const data = await getClientPrivateData({
      queryKey: [`${endpoint}?page=${page}&per_page=10`],
    });

    return data?.body;
  }

  useEffect(() => {
    getClientPrivateData({
      queryKey: [`${endpoint}?page=1&per_page=10`],
    })
      .then((res) => {
        setData(res || {});
      })
      .finally(() => {
        setIsLoadingData(false);
      });
  }, [endpoint]);

  if (isLoadingData) return <LoadingSpinner />;

  return data?.body?.length ? (
    <InfiniteScroll
      fetchData={fetchData}
      initialData={data?.body}
      pagination={data?.pagination}
      render={(data) => {
        console.log("🚀 ~ orders ~ data : ", type, data);
        return (
          <div dir="rtl" className="flex flex-col gap-12 md:gap-6">
            {data?.map((order) => {
              return isCourses ? (
                <CourseOrderCard key={order.id} courseOrder={order} />
              ) : (
                <BookOrderCard key={order.id} bookOrder={order} />
              );
            })}
          </div>
        );
      }}
    />
  ) : (
    <Empty text="لا يوجد طلبات بعد" />
  );
}

export default function Page() {
  const searchParams = useSearchParams();
  const orderType = searchParams.get("orderType") || "courses";

  return (
    <div className="wrapper my-[140px] space-y-6">
      <h2 className="text-2xl font-bold">الطلبات </h2>

      <Tabs defaultValue={orderType} className="space-y-6">
        {/* <TabsList className="w-full gap-6">
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
        </TabsList> */}

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
