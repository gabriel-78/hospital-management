import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import type { RescheduleConsultationPayload, ConsultationResponse } from "../schemas";

export async function rescheduleConsultation(payload: RescheduleConsultationPayload) {
  try {
    const { id, ...body } = payload;

    const response = await api.patch<Result<ConsultationResponse>>(
      ["/consultations", id, "reschedule"].join("/"),
      body,
    );

    if (response.data.success) {
      return success<ConsultationResponse>(response.data.data);
    } else return failure(response.data.error);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro ao reagendar a consulta");
  }
}
