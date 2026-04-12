import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoctor } from "../services";
import { queryKeys } from "@/infra/queryKeys";
import { toast } from "sonner";

export function useDeleteDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDoctor({ id }),
    onError: (error) => {
      if (error.error && typeof error.error === "string") {
        toast.error(`Erro deletar médico: ${error.error}`);
      }
    },
    onSuccess: (_, id) => {
      toast.success("Médico removido com sucesso.");

      const keysToInvalidate = queryKeys.doctors.invalidations.delete(id);

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
