import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useListPatients } from "../hooks/useListPatients";
import { BaseCard } from "../components/Cards/Base";
import type { PatientResponse } from "../schemas";
import { ManagePatientDialog } from "../components/Dialogs/Manage";

export function Patients() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<
    PatientResponse | undefined
  >(undefined);

  const patientsQuery = useListPatients();

  const patients = useMemo(() => {
    if (!patientsQuery.data || !patientsQuery.data.success) return [];

    return patientsQuery.data.data ?? [];
  }, [patientsQuery.data]);

  return (
    <div className="flex flex-col p-12 gap-8 w-full">
      <div className="flex w-full ">
        <div className="flex w-full flex-col gap-0.5 justify-start">
          <strong className="text-gray-800 font-bold text-2xl">
            Pacientes
          </strong>

          <span className="text-gray-600 text-base">
            Escolha um paciente para acessar seus dados.
          </span>
        </div>

        <Button type="button" onClick={() => setOpenDialog(true)}>
          <Plus />
          Novo paciente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-hidden overflow-y-auto">
        {patients.map((patient) => (
          <BaseCard
            key={patient.id}
            patient={patient}
            onSelected={(value) => {
              setSelectedPatient(value);
            }}
          />
        ))}
      </div>

      <ManagePatientDialog
        open={openDialog || !!selectedPatient}
        onOpenChange={(value) => {
          setOpenDialog(value);
          if (!value) setSelectedPatient(undefined);
        }}
        patient={selectedPatient}
      />
    </div>
  );
}
