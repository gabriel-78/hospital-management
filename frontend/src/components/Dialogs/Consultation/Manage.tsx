import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { ConsultationStatus, type Consultation } from "@/types/consultation";
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
import { currencyFormatter } from "@/utils/formatters/currency";

interface ManageConsultationDialogProps {
  open: boolean;
  onOpenChange: (oepn: boolean) => void;
  onCreated?: () => void;
  consultation?: Consultation;
}

const manageConsultationSchema = z.object({
  description: z.string(),
  type: z.enum(ConsultationStatus),
  date: z.date(),
  amount: z.number(),
  category: z.string(),
});

type ManageConsultationFormData = z.infer<typeof manageConsultationSchema>;

const moneyFormatter = currencyFormatter();

export function ManageConsultationDialog({
  open,
  onOpenChange,
  onCreated,
  consultation,
}: ManageConsultationDialogProps) {
  const form = useForm<ManageConsultationFormData>({
    resolver: zodResolver(manageConsultationSchema),
  });

  const doctors = useMemo(() => [], []);

  const createConsultation = (formData: unknown) => {
    console.log("create");
    onOpenChange(false);
  };

  const updateConsultation = (formData: unknown) => {
    console.log("update");
    onOpenChange(false);
  };

  const onSubmit = async (formData: ManageConsultationFormData) => {
    if (consultation) {
      await updateConsultation({
        variables: {
          updateTransactionId: consultation.id,
          data: {
            id: consultation.id,
            description: formData.description,
            amount: formData.amount,
            categoryId: formData.category,
            date: formData.date.toISOString(),
            type: formData.type,
          },
        },
      });
    } else {
      await createConsultation({
        variables: {
          data: {
            description: formData.description,
            amount: formData.amount,
            categoryId: formData.category,
            date: formData.date.toISOString(),
            type: formData.type,
          },
        },
      });
    }
  };

  useEffect(() => {
    if (open && consultation) {
      form.reset({
        description: consultation.description,
        amount: consultation.amount,
        category: consultation.categoryId,
        date: new Date(consultation.date),
        type: consultation.status,
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[28rem] w-full gap-6 rounded-xl">
        <DialogHeader className="">
          <DialogTitle className="text-gray-800 font-bold text-base text-left">
            {consultation ? "Editar consulta" : "Nova consulta"}
          </DialogTitle>

          <DialogDescription className="text-gray-600 text-sm text-left">
            {consultation
              ? "Ajuste a sua consulta"
              : "Registre a sua nova consulta"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit, (e) => {
            console.log(e);
          })}
          className="gap-4 flex flex-col w-full"
        >
          <Controller
            control={form.control}
            name="category"
            render={({ field }) => {
              return (
                <Field className="flex flex-col w-full gap-2">
                  <FieldLabel htmlFor="date-picker-simple">Médico</FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {doctors.map((doctor, idx) => (
                          <SelectItem key={idx} value={String(idx)}>
                            {`Doctor ${idx + 1}`}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              );
            }}
          />

          <div className="flex w-full gap-4">
            <Controller
              control={form.control}
              name="date"
              render={({ field }) => {
                return (
                  <Field className="flex flex-col w-full gap-2">
                    <FieldLabel htmlFor="date-picker-simple">Data</FieldLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <InputGroup>
                          <InputGroupInput
                            id="date-picker-simple"
                            type="text"
                            placeholder="Selecione"
                            value={
                              field.value ? format(field.value, "PPP") : ""
                            }
                            // disabled={
                            //   createConsultationMutation.loading ||
                            //   updateTransactionMutation.loading
                            // }
                          />
                        </InputGroup>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          defaultMonth={new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                );
              }}
            />
          </div>

          <div className="flex w-full pt-2">
            <Button
              type="submit"
              className="w-full"
              size={"md"}
              // disabled={
              //   createConsultationMutation.loading ||
              //   updateTransactionMutation.loading
              // }
            >
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
