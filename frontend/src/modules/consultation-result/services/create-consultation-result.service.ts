import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import type {
  CreateConsultationResultPayload,
  ConsultationResultResponse,
} from "../schemas";

export async function createConsultationResult(
  payload: CreateConsultationResultPayload,
) {
  try {
    const response = await api.post<Result<ConsultationResultResponse>>(
      "/consultation-results",
      payload,
    );

    if (response.data.success) {
      return success<ConsultationResultResponse>(response.data.data);
    } else return failure(response.data.error);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro ao registrar o resultado da consulta");
  }
}
