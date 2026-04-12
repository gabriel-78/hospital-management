import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  CreatePatientPayloadSchema,
  UpdatePatientPayloadSchema,
  type PatientResponse,
} from "../../schemas";
import { useCreatePatient, useUpdatePatient } from "../../hooks";

interface ManagePatientDialogProps {
  open: boolean;
  onOpenChange: (oepn: boolean) => void;
  patient?: PatientResponse;
}

const managePatientSchema = z.object({
  name: z.string(),
});

type ManagePatientFormData = z.infer<typeof managePatientSchema>;

export function ManagePatientDialog({
  open,
  onOpenChange,
  patient,
}: ManagePatientDialogProps) {
  const form = useForm<ManagePatientFormData>({
    resolver: zodResolver(managePatientSchema),
  });

  const createrPatientMutation = useCreatePatient();

  const updatePatientMutation = useUpdatePatient();

  const onCreate = async (formData: ManagePatientFormData) => {
    await createrPatientMutation
      .mutateAsync(CreatePatientPayloadSchema.parse(formData))
      .then(() => {
        onOpenChange(false);
      });
  };

  const onUpdate = async (formData: ManagePatientFormData) => {
    await updatePatientMutation
      .mutateAsync(
        UpdatePatientPayloadSchema.parse({ ...formData, id: patient?.id }),
      )
      .then(() => {
        onOpenChange(false);
      });
  };

  const onSubmit = async (formData: ManagePatientFormData) => {
    if (patient) {
      await onUpdate(formData);
    } else {
      await onCreate(formData);
    }
  };

  useEffect(() => {
    if (open) {
      form.reset({
        name: patient?.name,
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[28rem] w-full gap-6 rounded-xl">
        <DialogHeader className="">
          <DialogTitle className="text-gray-800 font-bold text-base text-left">
            {patient ? "Editar paciente" : "Novo paciente"}
          </DialogTitle>

          <DialogDescription className="text-gray-600 text-sm text-left">
            {patient
              ? "Ajuste os dados do paciente"
              : "Registre os dados do novo paciente"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit, (e) => {
            console.log(e);
          })}
          className="gap-4 flex flex-col w-full"
        >
          <Field className="flex flex-col w-full gap-2">
            <FieldLabel htmlFor="inline-start-input">Nome</FieldLabel>

            <InputGroup>
              <InputGroupInput
                id="inline-start-input"
                type="text"
                placeholder="Ex. Almoço no restaurante"
                {...form.register("name")}
                disabled={
                  createrPatientMutation.isPending ||
                  updatePatientMutation.isPending
                }
              />
            </InputGroup>
          </Field>

          <div className="flex w-full pt-2">
            <Button
              type="submit"
              className="w-full"
              size={"md"}
              disabled={
                createrPatientMutation.isPending ||
                updatePatientMutation.isPending
              }
            >
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
