import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConsultation } from "../services";
import { queryKeys } from "@/infra/queryKeys";
import type { CreateConsultationPayload } from "../schemas";
import { toast } from "sonner";

export function useCreateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateConsultationPayload) => createConsultation(payload),
    onError: (error) => {
      if (error.error && typeof error.error === "string") {
        toast.error(`Erro ao criar consulta: ${error.error}`);
      }
    },
    onSuccess: () => {
      toast.success("Consulta criada com sucesso.");

      const keysToInvalidate = queryKeys.consultations.invalidations.create();

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
