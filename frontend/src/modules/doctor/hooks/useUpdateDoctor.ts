import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDoctor } from "../services";
import { queryKeys } from "@/infra/queryKeys";
import type { UpdateDoctorPayload } from "../schemas";
import { toast } from "sonner";

export function useUpdateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDoctorPayload) => updateDoctor(payload),
    onError: (error) => {
      if (error.error && typeof error.error === "string") {
        toast.error(`Erro atualizando médico: ${error.error}`);
      }
    },
    onSuccess: () => {
      toast.success("Médico atualizado com sucesso.");

      const keysToInvalidate = queryKeys.doctors.invalidations.update();

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
