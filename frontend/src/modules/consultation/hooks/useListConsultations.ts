import { queryKeys } from "@/infra/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getListConsultations } from "../services";
import { useSessionStore } from "@/stores";

export function useListConsultations(filters?: {
  status?: string[];
  doctorId?: string;
}) {
  const patient = useSessionStore((state) => state.patient);

  return useQuery({
    queryKey: [
      ...queryKeys.consultations.list(),
      { patientId: patient?.id, doctorId: filters?.doctorId, status: filters?.status },
    ],
    queryFn: () =>
      getListConsultations({
        patientId: patient?.id ?? undefined,
        doctorId: filters?.doctorId,
        status: filters?.status,
      }),
    staleTime: 1000 * 60 * 5,
    enabled: !!patient?.id,
  });
}
