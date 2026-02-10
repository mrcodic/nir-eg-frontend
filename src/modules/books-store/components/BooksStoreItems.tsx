"use client";

import Empty from "@/components/Empty";
import LoadingSpinner from "@/components/LoadingSpinner";
import PaginationComponent from "@/components/Pagination";
import RoomHeader from "@/components/RoomHeader";
import { getClientData } from "@/helpers/client-fetch";
import { cn } from "@/lib/utils";
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
      getClientData<IPagination<Book>>({
        queryKey: [`books?per_page=${perPage}&page=` + page],
        optionalAuth: true,
      }),
    placeholderData: keepPreviousData,
  });

  console.log("books data :", data, error);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <Empty isError />;

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
