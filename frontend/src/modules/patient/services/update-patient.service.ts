import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import type { PatientResponse, UpdatePatientPayload } from "../schemas";

export async function updatePatient(payload: UpdatePatientPayload) {
  try {
    const { id, ...updateData } = payload;

    const response = await api.put<Result<PatientResponse>>(
      ["/patients", id].join("/"),
      updateData,
    );

    if (response.data.success) {
      return success<PatientResponse>(response.data.data);
    } else return failure(response.data.error);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro a requisitar os links");
  }
}
