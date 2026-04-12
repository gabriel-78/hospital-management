import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import type { DeleteDoctorPayload } from "../schemas";

export async function deleteDoctor(payload: DeleteDoctorPayload) {
  try {
    await api.delete<Result<void>>(["/doctors", payload.id].join("/"));

    return success<void>(undefined);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro a remover o médico");
  }
}
