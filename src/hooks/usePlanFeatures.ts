import { getPublicData } from "@/config/client-fetch";
import { useQuery } from "@tanstack/react-query";

function usePlanFeatures() {
  const query = useQuery({
    queryKey: ["/features"],
    queryFn: getPublicData as () => Promise<{ data: { keys: string[] } }>,
  });

  return { features: query.data?.data?.keys || [], isLoading: query.isLoading };
}

export default usePlanFeatures;
