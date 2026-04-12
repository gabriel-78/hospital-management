import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";
import { compareDesc, format } from "date-fns";
import type { ConsultationListItemResponse } from "../schemas";
import { useListConsultations } from "../hooks";

export function ConsultationHistory() {
  const consultationsQuery = useListConsultations({
    status: ["CANCELLED", "COMPLETED"],
  });

  const consultations = useMemo(() => {
    if (!consultationsQuery.data || !consultationsQuery.data.success) return [];

    return [...(consultationsQuery.data.data ?? [])].sort((a, b) =>
      compareDesc(a.scheduledAt, b.scheduledAt),
    );
  }, [consultationsQuery.data]);

  return (
    <div className="flex flex-col p-12 gap-8 w-full">
      <div className="flex w-full">
        <div className="flex w-full flex-col gap-0.5 justify-start">
          <strong className="text-gray-800 font-bold text-2xl">
            Histórico de Consultas
          </strong>

          <span className="text-gray-600 text-base">
            Visualize todas as consultas canceladas e concluídas do paciente.
          </span>
        </div>
      </div>

      <Table>
        <TableHeader className="sticky bg-background top-0">
          <TableRow>
            <TableHead className="uppercase text-xs tracking-[0.0375rem] text-gray-500 font-medium text-left">
              Médico
            </TableHead>

            <TableHead className="uppercase text-xs tracking-[0.0375rem] text-gray-500 font-medium text-center">
              Data
            </TableHead>

            <TableHead className="uppercase text-xs tracking-[0.0375rem] text-gray-500 font-medium text-right">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {consultations.map((consultation: ConsultationListItemResponse) => (
            <TableRow key={consultation.id} className="p-0">
              <TableCell className="font-medium">
                <div className="flex grow items-center justify-start gap-4">
                  <span className="text-base text-gray-800 font-medium">
                    {consultation.doctorName}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <span className="w-full text-sm text-gray-600 font-normal">
                  {format(consultation.scheduledAt, "dd/MM/yyyy HH:mm")}
                </span>
              </TableCell>

              <TableCell className="text-right">
                <span className="w-full text-sm text-gray-600 font-normal">
                  {consultation.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
