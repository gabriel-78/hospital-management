import { ManageConsultationDialog } from "../components/Dialogs/Manage";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, SquarePen, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import type { ConsultationListItemResponse } from "../schemas";
import { useListConsultations, useDeleteConsultation } from "../hooks";

export function ScheduleConsultations() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedConsultation, setSelectedConsultation] = useState<
    ConsultationListItemResponse | undefined
  >(undefined);

  const consultationsQuery = useListConsultations({ status: ["SCHEDULED"] });

  const deleteConsultationMutation = useDeleteConsultation();

  const consultations = useMemo(() => {
    if (!consultationsQuery.data || !consultationsQuery.data.success) return [];
    return consultationsQuery.data.data ?? [];
  }, [consultationsQuery.data]);

  return (
    <div className="flex flex-col p-12 gap-8 w-full">
      <div className="flex w-full ">
        <div className="flex w-full flex-col gap-0.5 justify-start">
          <strong className="text-gray-800 font-bold text-2xl">
            Agenda de Consultas
          </strong>

          <span className="text-gray-600 text-base">
            Gerencie todas as suas consultas agendadas, remarque ou cancele
            quando necessário.
          </span>
        </div>

        <Button type="button" onClick={() => setOpenDialog(true)}>
          <Plus />
          Nova consulta
        </Button>
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
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {consultations.map((consultation) => (
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
                <div className="flex grow items-center justify-end gap-2">
                  <IconButton
                    variant={"destructive"}
                    onClick={() =>
                      deleteConsultationMutation.mutate(consultation.id)
                    }
                    disabled={deleteConsultationMutation.isPending}
                  >
                    <Trash />
                  </IconButton>

                  <IconButton
                    onClick={() => setSelectedConsultation(consultation)}
                    disabled={deleteConsultationMutation.isPending}
                  >
                    <SquarePen />
                  </IconButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ManageConsultationDialog
        open={openDialog || !!selectedConsultation}
        onOpenChange={(value) => {
          setOpenDialog(value);
          if (!value) setSelectedConsultation(undefined);
        }}
        consultation={selectedConsultation}
      />
    </div>
  );
}
