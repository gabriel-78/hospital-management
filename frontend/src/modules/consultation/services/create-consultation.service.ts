import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import type { CreateConsultationPayload, ConsultationResponse } from "../schemas";

export async function createConsultation(payload: CreateConsultationPayload) {
  try {
    const response = await api.post<Result<ConsultationResponse>>(
      ["/consultations"].join("/"),
      payload,
    );

    if (response.data.success) {
      return success<ConsultationResponse>(response.data.data);
    } else return failure(response.data.error);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro ao criar a consulta");
  }
}
