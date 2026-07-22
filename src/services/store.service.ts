import { getServerData } from "@/helpers/fetchers/server-fetch";
import { BookLinksSettings } from "@/types/store.types";

export const getServerStoreSettings = async () => {
  const res = await getServerData<{ data: BookLinksSettings }>({
    queryKey: [`/settings/books`],
    optionalAuth: true,
  });
  const storeData = res?.data;
  const shouldShowStore = !storeData?.hide_books;

  return {
    storeData,
    shouldShowStore,
    shouldShowCart: shouldShowStore,
  };
};
