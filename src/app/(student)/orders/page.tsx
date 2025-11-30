"use client";

import Empty from "@/components/Empty";
import InfiniteScroll from "@/components/InfinteScroll";
import LoadingSpinner from "@/components/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import BookOrderCard from "./BookOrderCard";
import CourseOrderCard from "./CourseOrderCard";

function TransactionsList({ type = "course" }: { type: "course" | "cart" }) {
  const [bundlesData, setBundlesData] = React.useState([]);
  const [data, setData] = React.useState({});
  const [isLoadingData, setIsLoadingData] = React.useState(true);

  const isCourses = type === "course";

  async function fetchData(page = 1) {
    const data = await getClientPrivateData({
      queryKey: [`/payment/transaction?page=${page}&per_page=10&type=${type}`],
    });

    return data?.body;
  }

  useEffect(() => {
    getClientPrivateData({
      queryKey: [`/payment/transaction?page=1&per_page=10&type=${type}`],
    })
      .then((res) => {
        setBundlesData(res.body || []);
        setData(res || {});
      })
      .finally(() => {
        setIsLoadingData(false);
      });
  }, []);

  if (isLoadingData) return <LoadingSpinner />;

  return bundlesData?.length ? (
    <InfiniteScroll
      fetchData={fetchData}
      initialData={bundlesData}
      pagination={data?.pagination}
      render={(data) => {
        console.log("🚀 ~ page ~ data : ", type, data);
        return isCourses ? (
          <CourseOrderCard data={data} />
        ) : (
          <BookOrderCard data={data} />
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
    <div className="my-[120px] w-[90%] md:max-w-[80%] mx-auto space-y-6 ">
      <h2 className="text-2xl  font-bold">الطلبات </h2>

      <Tabs defaultValue={orderType} className="space-y-6">
        <TabsList className="w-full gap-6">
          <TabsTrigger
            value="books"
            className="data-[state=active]:bg-primary-800 data-[state=active]:text-white rounded-[10px] border border-gray-light h-11 font-bold p-2 px-3"
          >
            طلبات الكتب
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="data-[state=active]:bg-primary-800 data-[state=active]:text-white rounded-[10px] border border-gray-light h-11 font-bold p-2 px-3"
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
