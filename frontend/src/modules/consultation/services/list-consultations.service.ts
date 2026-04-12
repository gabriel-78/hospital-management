import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import {
  ListConsultationsResponseSchema,
  type ListConsultationsResponse,
} from "../schemas/response";

export async function getListConsultations() {
  try {
    const response = await api.get<Result<ListConsultationsResponse>>("/consultations");

    if (response.data.success) {
      const parsedValue = ListConsultationsResponseSchema.parse(response.data.data);

      return success<ListConsultationsResponse>(parsedValue);
    } else return failure(response.data.error);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro ao requisitar as consultas");
  }
}
