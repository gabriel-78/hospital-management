import { queryKeys } from "@/infra/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getListDoctors } from "../services";

export function useListDoctors() {
  return useQuery({
    queryKey: queryKeys.doctors.list(),
    queryFn: () => getListDoctors(),
    staleTime: 1000 * 60 * 5,
  });
}
