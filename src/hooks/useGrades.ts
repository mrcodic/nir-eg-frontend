import { getClientData } from "@/helpers/client-fetch";
import { useQuery } from "@tanstack/react-query";

const useGrades = () => {
  return useQuery({
    queryKey: ["grades"],
    queryFn: getClientData,
  });
};

export default useGrades;
