import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import type { CompleteConsultationPayload, ConsultationResponse } from "../schemas";

export async function completeConsultation(payload: CompleteConsultationPayload) {
  try {
    const response = await api.patch<Result<ConsultationResponse>>(
      ["/consultations", payload.id, "complete"].join("/"),
    );

    if (response.data.success) {
      return success<ConsultationResponse>(response.data.data);
    } else return failure(response.data.error);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro ao concluir a consulta");
  }
}
