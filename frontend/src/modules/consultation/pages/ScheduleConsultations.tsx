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
import type { ConsultationResponse } from "../schemas";
import { Plus, SquarePen, Trash } from "lucide-react";
import { useMemo, useState } from "react";

export function ScheduleConsultations() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedConsultation, setSelectedConsultation] = useState<
    ConsultationResponse | undefined
  >(undefined);

  const onDeleteConsultation = async (id: string) => {
    console.log("delete", id);
  };

  const consultations = useMemo(() => [], []);

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

      <Table className="">
        <TableHeader className="sticky bg-background top-0">
          <TableRow>
            <TableHead className="uppercase text-xs tracking-[0.0375rem] text-gray-500 font-medium text-left">
              Descrição
            </TableHead>

            <TableHead className="uppercase text-xs tracking-[0.0375rem] text-gray-500 font-medium text-center">
              Data
            </TableHead>

            <TableHead className="uppercase text-xs tracking-[0.0375rem] text-gray-500 font-medium text-center">
              Categoria
            </TableHead>

            <TableHead className="uppercase text-xs tracking-[0.0375rem] text-gray-500 font-medium text-center">
              Tipo
            </TableHead>

            <TableHead className="uppercase text-xs tracking-[0.0375rem] text-gray-500 font-medium text-right">
              Valor
            </TableHead>

            <TableHead className="uppercase text-xs tracking-[0.0375rem] text-gray-500 font-medium text-right">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {consultations.map((consultation, idx) => (
            <TableRow key={idx} className="p-0">
              <TableCell className="font-medium">
                <div className="flex grow items-center justify-start gap-4">
                  <span className="text-base text-gray-800 font-medium">
                    campo
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <span className="w-full text-sm text-gray-600 font-normal">
                  campo
                </span>
              </TableCell>

              <TableCell className="">
                <span className="w-full text-sm text-gray-600 font-normal">
                  campo
                </span>
              </TableCell>

              <TableCell className="text-right">
                <span className="w-full text-sm text-gray-600 font-normal">
                  campo
                </span>
              </TableCell>

              <TableCell className="text-right">
                <span className="w-full text-sm text-gray-600 font-normal">
                  campo
                </span>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex grow items-center justify-end gap-2">
                  <IconButton
                    variant={"destructive"}
                    className=""
                    onClick={() => onDeleteConsultation("<consultation-id>")}
                    // disabled={loading}
                  >
                    <Trash />
                  </IconButton>

                  <IconButton
                    className=""
                    // disabled={loading}
                    onClick={() => setSelectedConsultation(undefined)}
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
