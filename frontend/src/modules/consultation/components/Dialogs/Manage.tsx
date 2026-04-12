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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateConsultationPayloadSchema,
  RescheduleConsultationPayloadSchema,
  type ConsultationResponse,
} from "../../schemas";
import { useCreateConsultation, useRescheduleConsultation } from "../../hooks";
import { useListDoctors } from "@/modules/doctor/hooks";
import { useSessionStore } from "@/stores";

interface ManageConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultation?: ConsultationResponse;
}

const manageConsultationSchema = z.object({
  doctorId: z.string().optional(),
  scheduledAt: z.date(),
});

type ManageConsultationFormData = z.infer<typeof manageConsultationSchema>;

export function ManageConsultationDialog({
  open,
  onOpenChange,
  consultation,
}: ManageConsultationDialogProps) {
  const patient = useSessionStore((state) => state.patient);

  const form = useForm<ManageConsultationFormData>({
    resolver: zodResolver(manageConsultationSchema),
  });

  const createConsultationMutation = useCreateConsultation();
  const rescheduleConsultationMutation = useRescheduleConsultation();

  const doctorsQuery = useListDoctors();
  const doctors = useMemo(() => {
    if (!doctorsQuery.data?.success) return [];
    return doctorsQuery.data.data ?? [];
  }, [doctorsQuery.data]);

  const onCreate = async (formData: ManageConsultationFormData) => {
    await createConsultationMutation
      .mutateAsync(
        CreateConsultationPayloadSchema.parse({
          doctorId: formData.doctorId,
          patientId: patient?.id,
          scheduledAt: formData.scheduledAt,
        }),
      )
      .then(() => onOpenChange(false));
  };

  const onReschedule = async (formData: ManageConsultationFormData) => {
    await rescheduleConsultationMutation
      .mutateAsync(
        RescheduleConsultationPayloadSchema.parse({
          id: consultation?.id,
          scheduledAt: formData.scheduledAt,
        }),
      )
      .then(() => onOpenChange(false));
  };

  const onSubmit = async (formData: ManageConsultationFormData) => {
    if (consultation) {
      await onReschedule(formData);
    } else {
      await onCreate(formData);
    }
  };

  useEffect(() => {
    if (open) {
      form.reset({
        scheduledAt: consultation
          ? new Date(consultation.scheduledAt)
          : undefined,
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[28rem] w-full gap-6 rounded-xl">
        <DialogHeader className="">
          <DialogTitle className="text-gray-800 font-bold text-base text-left">
            {consultation ? "Remarcar consulta" : "Nova consulta"}
          </DialogTitle>

          <DialogDescription className="text-gray-600 text-sm text-left">
            {consultation
              ? "Selecione uma nova data e hora para a consulta"
              : "Registre a sua nova consulta"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit, (e) => {
            console.log(e);
          })}
          className="gap-4 flex flex-col w-full"
        >
          {!consultation && (
            <Controller
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <Field className="flex flex-col w-full gap-2">
                  <FieldLabel>Médico</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={
                      doctorsQuery.isLoading ||
                      createConsultationMutation.isPending
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          )}

          <Controller
            control={form.control}
            name="scheduledAt"
            render={({ field }) => (
              <Field className="flex flex-col w-full gap-2">
                <FieldLabel>Data e hora</FieldLabel>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <InputGroup className="flex-1">
                        <InputGroupInput
                          type="text"
                          placeholder="Selecione a data"
                          readOnly
                          value={
                            field.value ? format(field.value, "dd/MM/yyyy") : ""
                          }
                          disabled={
                            createConsultationMutation.isPending ||
                            rescheduleConsultationMutation.isPending
                          }
                        />
                      </InputGroup>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (!date) return;
                          const current = field.value ?? new Date();
                          date.setHours(
                            current.getHours(),
                            current.getMinutes(),
                            0,
                            0,
                          );
                          field.onChange(date);
                        }}
                        defaultMonth={new Date()}
                      />
                    </PopoverContent>
                  </Popover>

                  <InputGroup className="w-36">
                    <InputGroupInput
                      type="time"
                      value={field.value ? format(field.value, "HH:mm") : ""}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value
                          .split(":")
                          .map(Number);
                        const date = field.value
                          ? new Date(field.value)
                          : new Date();
                        date.setHours(hours, minutes, 0, 0);
                        field.onChange(date);
                      }}
                      disabled={
                        createConsultationMutation.isPending ||
                        rescheduleConsultationMutation.isPending
                      }
                    />
                  </InputGroup>
                </div>
              </Field>
            )}
          />

          <div className="flex w-full pt-2">
            <Button
              type="submit"
              className="w-full"
              size={"md"}
              disabled={
                createConsultationMutation.isPending ||
                rescheduleConsultationMutation.isPending
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
