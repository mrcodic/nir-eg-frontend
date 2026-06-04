// hooks/useBooksSettings.ts
import { getClientData } from "@/helpers/fetchers/client-fetch";
import { BookLinksSettings } from "@/types/books.types";
import { useQuery } from "@tanstack/react-query";

export function useBooksSettings() {
  const { data } = useQuery<{ data: BookLinksSettings }>({
    queryKey: ["settings/books"],
    queryFn: getClientData,
  });

  const booksData = data?.data;
  const shouldShowBooks = !!booksData?.links?.length || !booksData?.hide_books;

  return {
    booksData,
    shouldShowBooks,
    shouldShowCart: !booksData?.hide_books,
  };
}
