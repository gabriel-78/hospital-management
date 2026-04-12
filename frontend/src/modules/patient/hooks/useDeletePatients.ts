import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePatient } from "../services";
import { queryKeys } from "@/infra/queryKeys";

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePatient({ id }),
    onSuccess: (_, id) => {
      const keysToInvalidate = queryKeys.patients.invalidations.delete(id);

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
