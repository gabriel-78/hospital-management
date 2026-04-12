import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rescheduleConsultation } from "../services";
import { queryKeys } from "@/infra/queryKeys";
import type { RescheduleConsultationPayload } from "../schemas";
import { toast } from "sonner";

export function useRescheduleConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RescheduleConsultationPayload) => rescheduleConsultation(payload),
    onError: (error) => {
      if (error.error && typeof error.error === "string") {
        toast.error(`Erro ao reagendar consulta: ${error.error}`);
      }
    },
    onSuccess: () => {
      toast.success("Consulta reagendada com sucesso.");

      const keysToInvalidate = queryKeys.consultations.invalidations.reschedule();

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
