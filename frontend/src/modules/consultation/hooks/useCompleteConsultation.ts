import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeConsultation } from "../services";
import { queryKeys } from "@/infra/queryKeys";
import { toast } from "sonner";

export function useCompleteConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => completeConsultation({ id }),
    onError: (error) => {
      if (error.error && typeof error.error === "string") {
        toast.error(`Erro ao concluir consulta: ${error.error}`);
      }
    },
    onSuccess: (_, id) => {
      toast.success("Consulta concluída com sucesso.");

      const keysToInvalidate = queryKeys.consultations.invalidations.complete(id);

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
