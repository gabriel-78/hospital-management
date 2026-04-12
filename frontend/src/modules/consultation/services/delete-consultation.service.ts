import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import type { DeleteConsultationPayload } from "../schemas";

export async function deleteConsultation(payload: DeleteConsultationPayload) {
  try {
    await api.delete<Result<void>>(["/consultations", payload.id].join("/"));

    return success<void>(undefined);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro ao remover a consulta");
  }
}
