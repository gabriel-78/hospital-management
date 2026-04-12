import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useListDoctors } from "../hooks/useListDoctors";
import { BaseCard } from "../components/Cards/Base";
import type { DoctorResponse } from "../schemas";
import { ManageDoctorDialog } from "../components/Dialogs/Manage";
import { useSessionStore } from "@/stores";

export function Doctors() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<
    DoctorResponse | undefined
  >(undefined);

  const { changeDoctor, cleanDoctor, changeSession } = useSessionStore(
    (state) => state,
  );

  const doctorsQuery = useListDoctors();

  const doctors = useMemo(() => {
    if (!doctorsQuery.data || !doctorsQuery.data.success) return [];

    return doctorsQuery.data.data ?? [];
  }, [doctorsQuery.data]);

  useEffect(() => {
    changeSession("doctor");
    cleanDoctor();
  }, []);

  return (
    <div className="flex flex-col p-12 gap-8 w-full">
      <div className="flex w-full ">
        <div className="flex w-full flex-col gap-0.5 justify-start">
          <strong className="text-gray-800 font-bold text-2xl">Médicos</strong>

          <span className="text-gray-600 text-base">
            Escolha um médico para acessar seus dados.
          </span>
        </div>

        <Button type="button" onClick={() => setOpenDialog(true)}>
          <Plus />
          Novo médico
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-hidden overflow-y-auto">
        {doctors.map((patient) => (
          <BaseCard
            key={patient.id}
            doctor={patient}
            onSelected={(value, type) => {
              if (type === "select") {
                changeDoctor(value);
              } else if (type === "edit") {
                setSelectedDoctor(value);
              }
            }}
          />
        ))}
      </div>

      <ManageDoctorDialog
        open={openDialog || !!selectedDoctor}
        onOpenChange={(value) => {
          setOpenDialog(value);
          if (!value) setSelectedDoctor(undefined);
        }}
        doctor={selectedDoctor}
      />
    </div>
  );
}
