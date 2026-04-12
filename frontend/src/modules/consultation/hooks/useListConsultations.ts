import { queryKeys } from "@/infra/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getListConsultations } from "../services";

export function useListConsultations() {
  return useQuery({
    queryKey: queryKeys.consultations.list(),
    queryFn: () => getListConsultations(),
    staleTime: 1000 * 60 * 5,
  });
}
