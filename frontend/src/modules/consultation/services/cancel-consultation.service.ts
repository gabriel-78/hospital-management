import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import type { CancelConsultationPayload, ConsultationResponse } from "../schemas";

export async function cancelConsultation(payload: CancelConsultationPayload) {
  try {
    const response = await api.patch<Result<ConsultationResponse>>(
      ["/consultations", payload.id, "cancel"].join("/"),
    );

    if (response.data.success) {
      return success<ConsultationResponse>(response.data.data);
    } else return failure(response.data.error);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro ao cancelar a consulta");
  }
}
