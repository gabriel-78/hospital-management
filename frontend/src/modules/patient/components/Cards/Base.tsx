import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PatientResponse } from "../../schemas";
import { IconButton } from "@/components/ui/icon-button";
import { SquarePen, Trash, User } from "lucide-react";
import { useDeletePatient } from "../../hooks/useDeletePatients";

interface BaseCardProps {
  patient: PatientResponse;
  onSelected: (value: PatientResponse, type: "edit" | "select") => void;
}

export function BaseCard({ ...props }: BaseCardProps) {
  const deletePatient = useDeletePatient();

  const onDeleteCategory = async () => {
    await deletePatient.mutateAsync(props.patient.id);
  };

  return (
    <Card
      className="w-full cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={(e) => {
        e.preventDefault();
        props.onSelected(props.patient, "select");
      }}
    >
      <CardHeader className="flex w-full justify-end flex-row">
        <div className="flex gap-2 justify-end items-center shrink-0">
          <IconButton
            variant={"destructive"}
            className=""
            onClick={onDeleteCategory}
            disabled={deletePatient.isPending}
          >
            <Trash />
          </IconButton>

          <IconButton
            className=""
            disabled={deletePatient.isPending}
            onClick={(e) => {
              e.preventDefault();
              props.onSelected(props.patient, "edit");
            }}
          >
            <SquarePen />
          </IconButton>
        </div>
      </CardHeader>

      <CardContent className="items-center justify-center flex shrink-0 w-full flex-col gap-2">
        <figure className="flex -mt-6 items-center justify-center rounded-full bg-gray-300 text-gray-800 size-16">
          <User />
        </figure>

        <CardTitle className="text-base text-gray-800 font-semibold truncate w-full text-center">
          {props.patient?.name ?? ""}
        </CardTitle>
      </CardContent>
    </Card>
  );
}
