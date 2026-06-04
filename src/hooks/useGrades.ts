import { getClientData } from "@/helpers/fetchers/client-fetch";
import { useQuery } from "@tanstack/react-query";

const useGrades = () => {
  return useQuery({
    queryKey: ["grades"],
    queryFn: getClientData,
  });
};

export default useGrades;
