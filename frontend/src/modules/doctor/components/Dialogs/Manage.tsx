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
  CreateDoctorPayloadSchema,
  UpdateDoctorPayloadSchema,
  type DoctorResponse,
} from "../../schemas";
import { useCreateDoctor, useUpdateDoctor } from "../../hooks";

interface ManageDoctorDialogProps {
  open: boolean;
  onOpenChange: (oepn: boolean) => void;
  doctor?: DoctorResponse;
}

const manageDoctorSchema = z.object({
  name: z.string(),
  crm: z.string(),
});

type ManageDoctorFormData = z.infer<typeof manageDoctorSchema>;

export function ManageDoctorDialog({
  open,
  onOpenChange,
  doctor,
}: ManageDoctorDialogProps) {
  const form = useForm<ManageDoctorFormData>({
    resolver: zodResolver(manageDoctorSchema),
  });

  const createrDoctorMutation = useCreateDoctor();

  const updateDoctorMutation = useUpdateDoctor();

  const onCreate = async (formData: ManageDoctorFormData) => {
    await createrDoctorMutation
      .mutateAsync(CreateDoctorPayloadSchema.parse(formData))
      .then(() => {
        onOpenChange(false);
      });
  };

  const onUpdate = async (formData: ManageDoctorFormData) => {
    await updateDoctorMutation
      .mutateAsync(
        UpdateDoctorPayloadSchema.parse({ ...formData, id: doctor?.id }),
      )
      .then(() => {
        onOpenChange(false);
      });
  };

  const onSubmit = async (formData: ManageDoctorFormData) => {
    if (doctor) {
      await onUpdate(formData);
    } else {
      await onCreate(formData);
    }
  };

  useEffect(() => {
    if (open) {
      form.reset({
        name: doctor?.name,
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[28rem] w-full gap-6 rounded-xl">
        <DialogHeader className="">
          <DialogTitle className="text-gray-800 font-bold text-base text-left">
            {doctor ? "Editar médico" : "Novo médico"}
          </DialogTitle>

          <DialogDescription className="text-gray-600 text-sm text-left">
            {doctor
              ? "Ajuste os dados do médico"
              : "Registre os dados do novo médico"}
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
                placeholder="Ex. João Paulo"
                {...form.register("name")}
                disabled={
                  createrDoctorMutation.isPending ||
                  updateDoctorMutation.isPending
                }
              />
            </InputGroup>
          </Field>

          <Field className="flex flex-col w-full gap-2">
            <FieldLabel htmlFor="inline-start-input">CRM</FieldLabel>

            <InputGroup>
              <InputGroupInput
                id="inline-start-input"
                type="text"
                placeholder="Ex. 123456-SP"
                {...form.register("crm")}
                disabled={
                  createrDoctorMutation.isPending ||
                  updateDoctorMutation.isPending
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
                createrDoctorMutation.isPending ||
                updateDoctorMutation.isPending
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
