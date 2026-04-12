import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import type { CreatePatientPayload, PatientResponse } from "../schemas";

export async function createPatient(payload: CreatePatientPayload) {
  try {
    const response = await api.post<Result<PatientResponse>>(
      ["/patients"].join("/"),
      payload,
    );

    if (response.data.success) {
      return success<PatientResponse>(response.data.data);
    } else return failure(response.data.error);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro a requisitar os links");
  }
}
