"use client";

import Empty from "@/components/shared/Empty";
import PaginationComponent from "@/components/shared/Pagination";
import { useCartStore } from "@/context/BooksStoreProvider";
import { getClientData } from "@/helpers/fetchers/client-fetch";
import { cn } from "@/lib/utils";
import RoomHeader from "@/modules/rooms/components/RoomHeader";
import StoreItemCardSkeleton from "@/modules/store/components/StoreItemCardSkeleton";
import { IPagination } from "@/types";
import { Book } from "@/types/books.types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import StoreItemsDisplayGrid from "./StoreItemsDisplayGrid";

function StoreItems({
  perPage = 8,
  title,
  className,
  itemsClassName,
  hideOnEmptyCart,
}: {
  perPage?: number;
  title?: string;
  className?: string;
  itemsClassName?: string;
  hideOnEmptyCart?: boolean;
}) {
  const { getTotalItems } = useCartStore();

  const [page, setPage] = useState(1);

  const { data, error, isLoading, isPlaceholderData } = useQuery({
    queryKey: [`store-items`, page],
    queryFn: () =>
      getClientData<IPagination<Book[]>>({
        queryKey: [`books?per_page=${perPage}&page=` + page],
        optionalAuth: true,
      }),
    placeholderData: keepPreviousData,
  });

  if (hideOnEmptyCart && getTotalItems() === 0) return null;

  return (
    <section className={className}>
      <RoomHeader
        icon={"/assets/books-colored.svg"}
        title={title || "المنتجات المتاحة "}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <StoreItemCardSkeleton key={i} />
          ))}
        </div>
      ) : !!data?.data?.length ? (
        <StoreItemsDisplayGrid
          items={data?.data}
          className={cn(
            itemsClassName,
            isPlaceholderData
              ? "pointer-events-none animate-pulse opacity-80"
              : "",
          )}
        />
      ) : error ? (
        <Empty isError text="حدث خطأ ما اثناء عرض المنتجات" />
      ) : (
        <Empty
          text={
            data?.meta?.current_page === 1
              ? "لا يوجد منتجات متاحة"
              : "لا يوجد منتجات فى هذه الصفحة"
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

export default StoreItems;
