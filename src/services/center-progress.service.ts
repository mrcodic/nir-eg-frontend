import "server-only";

import { getServerData } from "@/helpers/fetchers/server-fetch";
import { CenterProgressResponse } from "@/types/center-progress.types";

export async function getCenterProgress() {
  const response = await getServerData<CenterProgressResponse>({
    queryKey: ["/students/center-progress"],
    cache: "no-store",
  });

  if (!response?.status) {
    throw new Error("تعذر تحميل بيانات الحضور والتقييمات");
  }

  return response.data;
}
