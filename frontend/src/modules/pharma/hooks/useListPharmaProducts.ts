import { queryKeys } from "@/infra/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getListPharmaProducts } from "../services";
import type { ListPharmaProductsPayload } from "../schemas";

export function useListPharmaProducts(
  filters?: ListPharmaProductsPayload,
  enabled = true,
) {
  return useQuery({
    queryKey: [...queryKeys.pharmaProducts.list(), filters],
    queryFn: () => getListPharmaProducts(filters),
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}
