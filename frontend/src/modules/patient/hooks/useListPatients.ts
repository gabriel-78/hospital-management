import { queryKeys } from "@/infra/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getListPatients } from "../services";

export function useListPatients() {
  return useQuery({
    queryKey: queryKeys.patients.list(),
    queryFn: () => getListPatients(),
    staleTime: 1000 * 60 * 5,
  });
}
