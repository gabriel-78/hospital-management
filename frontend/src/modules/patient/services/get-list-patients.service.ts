import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import {
  ListPatientResponseSchema,
  type ListPatientResponse,
} from "../schemas/response";

export async function getListPatients() {
  try {
    const response = await api.get<Result<ListPatientResponse>>("/patients");

    if (response.data.success) {
      const parsedValue = ListPatientResponseSchema.parse(response.data.data);

      return success<ListPatientResponse>(parsedValue);
    } else return failure(response.data.error);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro a requisitar os pacientes");
  }
}
