"use client";

import Empty from "@/components/shared/Empty";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import PaginationComponent from "@/components/shared/Pagination";
import { getClientData } from "@/helpers/client-fetch";
import { cn } from "@/lib/utils";
import RoomHeader from "@/modules/rooms/components/RoomHeader";
import { IPagination } from "@/types";
import { Book } from "@/types/books.types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import BooksGrid from "./BooksGrid";

function BooksStoreItems({
  perPage = 8,
  title,
  className,
  booksClassName,
}: {
  perPage?: number;
  title?: string;
  className?: string;
  booksClassName?: string;
}) {
  const [page, setPage] = useState(1);

  const { data, error, isLoading, isPlaceholderData } = useQuery({
    queryKey: [`books-items`, page],
    queryFn: () =>
      getClientData<IPagination<Book[]>>({
        queryKey: [`books?per_page=${perPage}&page=` + page],
        optionalAuth: true,
      }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <LoadingSpinner />;

  if (error) return <Empty isError text="حدث خطأ ما اثناء عرض الكتب" />;

  return (
    <section className={className}>
      <RoomHeader icon={"/assets/books-colored.svg"} title={title || "الكتب"} />

      {data?.data?.length ? (
        <BooksGrid
          books={data?.data}
          className={cn(
            booksClassName,
            isPlaceholderData
              ? "pointer-events-none animate-pulse opacity-80"
              : "",
          )}
        />
      ) : (
        <Empty
          text={
            data?.meta?.current_page === 1
              ? "لا يوجد كتب فى المخزون"
              : "لا يوجد كتب فى هذه الصفحة"
          }
        />
      )}

      {!!data?.meta?.total && (
        <PaginationComponent
          currentPage={page}
          total={data?.meta.total}
          setPage={setPage}
          pageSize={data?.meta.per_page}
          className="mt-10"
        />
      )}
    </section>
  );
}

export default BooksStoreItems;
