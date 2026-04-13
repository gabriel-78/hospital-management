import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConsultationResult } from "../services";
import { queryKeys } from "@/infra/queryKeys";
import type { CreateConsultationResultPayload } from "../schemas";
import { toast } from "sonner";

export function useCreateConsultationResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateConsultationResultPayload) =>
      createConsultationResult(payload),
    onError: (error) => {
      if (error.error && typeof error.error === "string") {
        toast.error(`Erro ao registrar resultado: ${error.error}`);
      }
    },
    onSuccess: () => {
      toast.success("Resultado da consulta registrado com sucesso.");

      const keysToInvalidate =
        queryKeys.consultationResults.invalidations.create();

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
