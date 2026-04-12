import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import {
  ListConsultationsResponseSchema,
  type ListConsultationsResponse,
} from "../schemas/response";

export interface ListConsultationsFilters {
  patientId?: string;
  status?: string[];
}

export async function getListConsultations(filters?: ListConsultationsFilters) {
  try {
    const response = await api.get<Result<ListConsultationsResponse>>(
      "/consultations",
      {
        params: filters,
        paramsSerializer: (params) => {
          const search = new URLSearchParams();
          if (params.patientId) search.append("patientId", params.patientId);
          params.status?.forEach((s: string) => search.append("status", s));
          return search.toString();
        },
      },
    );

    if (response.data.success) {
      const parsedValue = ListConsultationsResponseSchema.parse(
        response.data.data,
      );

      return success<ListConsultationsResponse>(parsedValue);
    } else return failure(response.data.error);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro ao requisitar as consultas");
  }
}
