import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDoctor } from "../services";
import { queryKeys } from "@/infra/queryKeys";
import type { CreateDoctorPayload } from "../schemas";
import { toast } from "sonner";

export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDoctorPayload) => createDoctor(payload),
    onError: (error) => {
      if (error.error && typeof error.error === "string") {
        toast.error(`Erro criando médico: ${error.error}`);
      }
    },
    onSuccess: () => {
      toast.success("Médico criado com sucesso.");

      const keysToInvalidate = queryKeys.doctors.invalidations.create();

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
