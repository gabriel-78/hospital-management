import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DoctorResponse } from "../../schemas";
import { IconButton } from "@/components/ui/icon-button";
import { SquarePen, Trash, User } from "lucide-react";
import { memo, useCallback } from "react";
import { useDeleteDoctor } from "../../hooks";

interface BaseCardProps {
  doctor: DoctorResponse;
  onSelected: (value: DoctorResponse, type: "edit" | "select") => void;
}

export const BaseCard = memo(function BaseCard({
  doctor,
  onSelected,
}: BaseCardProps) {
  const deleteDoctor = useDeleteDoctor();

  const onDeleteCategory = useCallback(async () => {
    await deleteDoctor.mutateAsync(doctor.id);
  }, [deleteDoctor, doctor.id]);

  const handleSelect = useCallback(
    (type: "edit" | "select") => (e: React.MouseEvent) => {
      e.preventDefault();
      onSelected(doctor, type);
    },
    [onSelected, doctor],
  );

  return (
    <Card
      className="w-full cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleSelect("select")}
    >
      <CardHeader className="flex w-full justify-end flex-row">
        <div className="flex gap-2 justify-end items-center shrink-0">
          <IconButton
            variant={"destructive"}
            className=""
            onClick={onDeleteCategory}
            disabled={deleteDoctor.isPending}
          >
            <Trash />
          </IconButton>

          <IconButton
            className=""
            disabled={deleteDoctor.isPending}
            onClick={handleSelect("edit")}
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
          {doctor?.name ?? ""}
        </CardTitle>
      </CardContent>
    </Card>
  );
});

BaseCard.displayName = "DoctorBaseCard";
