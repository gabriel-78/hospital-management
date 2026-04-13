import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput, InputGroupTextarea } from "@/components/ui/input-group";
import { z } from "zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Plus, Trash } from "lucide-react";
import { CreateConsultationResultPayloadSchema } from "../../schemas";
import { useCreateConsultationResult } from "../../hooks";
import { useSessionStore } from "@/stores";

interface CreateConsultationResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultationId: string;
}

const createConsultationResultSchema = z.object({
  description: z.string().min(1),
  items: z.array(
    z.object({
      remedyId: z.string().optional(),
      medication: z.string().min(1),
      dosage: z.string().min(1),
      duration: z.string().min(1),
      instructions: z.string().optional(),
    }),
  ),
});

type CreateConsultationResultFormData = z.infer<
  typeof createConsultationResultSchema
>;

export function CreateConsultationResultDialog({
  open,
  onOpenChange,
  consultationId,
}: CreateConsultationResultDialogProps) {
  const doctor = useSessionStore((state) => state.doctor);

  const form = useForm<CreateConsultationResultFormData>({
    resolver: zodResolver(createConsultationResultSchema),
    defaultValues: { items: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const createConsultationResultMutation = useCreateConsultationResult();

  const onSubmit = async (formData: CreateConsultationResultFormData) => {
    await createConsultationResultMutation
      .mutateAsync(
        CreateConsultationResultPayloadSchema.parse({
          consultationId,
          doctorId: doctor?.id,
          description: formData.description,
          prescription:
            formData.items.length > 0
              ? {
                  items: formData.items.map((item) => ({
                    remedyId: item.remedyId || undefined,
                    medication: item.medication,
                    dosage: item.dosage,
                    duration: item.duration,
                    instructions: item.instructions || undefined,
                  })),
                }
              : undefined,
        }),
      )
      .then(() => onOpenChange(false));
  };

  useEffect(() => {
    if (open) {
      form.reset({ description: "", items: [] });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[36rem] w-full gap-6 rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-800 font-bold text-base text-left">
            Resultado da Consulta
          </DialogTitle>

          <DialogDescription className="text-gray-600 text-sm text-left">
            Registre o resultado e a prescrição médica, se necessário.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <Field className="flex flex-col w-full gap-2">
                <FieldLabel>Descrição</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    placeholder="Descreva o resultado da consulta"
                    rows={3}
                    disabled={createConsultationResultMutation.isPending}
                    {...field}
                  />
                </InputGroup>
              </Field>
            )}
          />

          {fields.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-gray-700">
                Prescrição
              </span>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Medicamento {index + 1}
                    </span>

                    <IconButton
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                      disabled={createConsultationResultMutation.isPending}
                    >
                      <Trash />
                    </IconButton>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Controller
                      control={form.control}
                      name={`items.${index}.medication`}
                      render={({ field: f }) => (
                        <Field className="flex flex-col gap-1.5 col-span-2">
                          <FieldLabel>Medicamento</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              placeholder="ex: Amoxicilina 500mg"
                              disabled={createConsultationResultMutation.isPending}
                              {...f}
                            />
                          </InputGroup>
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name={`items.${index}.dosage`}
                      render={({ field: f }) => (
                        <Field className="flex flex-col gap-1.5">
                          <FieldLabel>Dosagem</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              placeholder="ex: 1 comprimido"
                              disabled={createConsultationResultMutation.isPending}
                              {...f}
                            />
                          </InputGroup>
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name={`items.${index}.duration`}
                      render={({ field: f }) => (
                        <Field className="flex flex-col gap-1.5">
                          <FieldLabel>Duração</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              placeholder="ex: 7 dias"
                              disabled={createConsultationResultMutation.isPending}
                              {...f}
                            />
                          </InputGroup>
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name={`items.${index}.instructions`}
                      render={({ field: f }) => (
                        <Field className="flex flex-col gap-1.5 col-span-2">
                          <FieldLabel>Instruções (opcional)</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              placeholder="ex: Tomar após as refeições"
                              disabled={createConsultationResultMutation.isPending}
                              {...f}
                            />
                          </InputGroup>
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name={`items.${index}.remedyId`}
                      render={({ field: f }) => (
                        <Field className="flex flex-col gap-1.5 col-span-2">
                          <FieldLabel>ID Externo ERP (opcional)</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              placeholder="UUID do medicamento no ERP farmacológico"
                              disabled={createConsultationResultMutation.isPending}
                              {...f}
                            />
                          </InputGroup>
                        </Field>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                remedyId: "",
                medication: "",
                dosage: "",
                duration: "",
                instructions: "",
              })
            }
            disabled={createConsultationResultMutation.isPending}
          >
            <Plus />
            Adicionar medicamento
          </Button>

          <div className="flex w-full pt-2">
            <Button
              type="submit"
              className="w-full"
              size="md"
              disabled={createConsultationResultMutation.isPending}
            >
              Salvar resultado
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
