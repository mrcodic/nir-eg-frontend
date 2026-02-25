// hooks/useBooksSettings.ts
import { useQuery } from "@tanstack/react-query";
import { getClientData } from "@/helpers/client-fetch";
import { BookLinksSettings } from "@/types/books.types";

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
