import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import type { DeletePatientPayload } from "../schemas";

export async function deletePatient(payload: DeletePatientPayload) {
  try {
    await api.delete<Result<void>>(["/patients", payload.id].join("/"));

    return success<void>(undefined);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro a remover o paciente");
  }
}
