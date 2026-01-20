import { getPublicData } from "@/helpers/client-fetch";
import { useQuery } from "@tanstack/react-query";

const useGrades = () => {
  return useQuery({
    queryKey: ["grades"],
    queryFn: getPublicData,
  });
};

export default useGrades;
