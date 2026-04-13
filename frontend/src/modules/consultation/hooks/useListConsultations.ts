import { queryKeys } from "@/infra/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getListConsultations } from "../services";
import { useSessionStore } from "@/stores";

export function useListConsultations(filters?: { status?: string[] }) {
  const session = useSessionStore((state) => state.session);
  const patient = useSessionStore((state) => state.patient);
  const doctor = useSessionStore((state) => state.doctor);

  const patientId = session === "patient" ? patient?.id : undefined;
  const doctorId = session === "doctor" ? doctor?.id : undefined;

  return useQuery({
    queryKey: [
      ...queryKeys.consultations.list(),
      { patientId, doctorId, status: filters?.status },
    ],
    queryFn: () =>
      getListConsultations({ patientId, doctorId, status: filters?.status }),
    staleTime: 1000 * 60 * 5,
    enabled: !!patient?.id || !!doctor?.id,
  });
}
