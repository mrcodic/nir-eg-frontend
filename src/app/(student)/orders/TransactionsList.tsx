"use client";

import Empty from "@/components/shared/Empty";
import InfiniteScroll from "@/components/shared/InfinteScroll";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { BooksOrder, CourseOrder } from "@/types";
import { useEffect, useState } from "react";
import BookOrderCard from "./BookOrderCard";
import CourseOrderCard from "./CourseOrderCard";

export default function TransactionsList({
  type = "course",
}: {
  type: "course" | "cart";
}) {
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
      render={(data) => (
        <div dir="rtl" className="flex flex-col gap-12 md:gap-6">
          {data?.map((order) =>
            isCourses ? (
              <CourseOrderCard key={order.id} courseOrder={order} />
            ) : (
              <BookOrderCard key={order.id} bookOrder={order} />
            ),
          )}
        </div>
      )}
    />
  ) : (
    <Empty text="لا يوجد طلبات بعد" />
  );
}
