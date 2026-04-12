import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteConsultation } from "../services";
import { queryKeys } from "@/infra/queryKeys";
import { toast } from "sonner";

export function useDeleteConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteConsultation({ id }),
    onError: (error) => {
      if (error.error && typeof error.error === "string") {
        toast.error(`Erro ao remover consulta: ${error.error}`);
      }
    },
    onSuccess: (_, id) => {
      toast.success("Consulta removida com sucesso.");

      const keysToInvalidate = queryKeys.consultations.invalidations.delete(id);

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
