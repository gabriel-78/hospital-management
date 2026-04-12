import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePatient } from "../services";
import { queryKeys } from "@/infra/queryKeys";
import type { UpdatePatientPayload } from "../schemas";
import { toast } from "sonner";

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePatientPayload) => updatePatient(payload),
    onError: (error) => {
      if (error.error && typeof error.error === "string") {
        toast.error(`Erro atualizando paciente: ${error.error}`);
      }
    },
    onSuccess: () => {
      toast.success("Paciente atualizado com sucesso.");

      const keysToInvalidate = queryKeys.patients.invalidations.update();

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
