import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPatient } from "../services";
import { queryKeys } from "@/infra/queryKeys";
import type { CreatePatientPayload } from "../schemas";
import { toast } from "sonner";

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePatientPayload) => createPatient(payload),
    onError: (error) => {
      if (error.error && typeof error.error === "string") {
        toast.error(`Erro criando paciente: ${error.error}`);
      }
    },
    onSuccess: () => {
      toast.success("Paciente criado com sucesso.");

      const keysToInvalidate = queryKeys.patients.invalidations.create();

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
