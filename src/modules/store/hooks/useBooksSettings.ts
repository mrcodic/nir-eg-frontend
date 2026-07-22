// hooks/useBooksSettings.ts
import { getClientData } from "@/helpers/fetchers/client-fetch";
import { BookLinksSettings } from "@/types/store.types";
import { useQuery } from "@tanstack/react-query";

export function useBooksSettings({ enabled }) {
  const { data } = useQuery<{ data: BookLinksSettings }>({
    queryKey: ["settings/books"],
    queryFn: getClientData,
    enabled,
  });

  const booksData = data?.data;
  const shouldShowBooks = !booksData?.hide_books;
  // const shouldShowBooks = !!booksData?.links?.length || !booksData?.hide_books;

  return {
    booksData,
    shouldShowBooks,
    shouldShowCart: shouldShowBooks,
  };
}
