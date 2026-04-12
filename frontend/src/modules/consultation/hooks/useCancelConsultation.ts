import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelConsultation } from "../services";
import { queryKeys } from "@/infra/queryKeys";
import { toast } from "sonner";

export function useCancelConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelConsultation({ id }),
    onError: (error) => {
      if (error.error && typeof error.error === "string") {
        toast.error(`Erro ao cancelar consulta: ${error.error}`);
      }
    },
    onSuccess: (_, id) => {
      toast.success("Consulta cancelada com sucesso.");

      const keysToInvalidate = queryKeys.consultations.invalidations.cancel(id);

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
