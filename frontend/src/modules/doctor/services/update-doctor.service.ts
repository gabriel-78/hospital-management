import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import type { DoctorResponse, UpdateDoctorPayload } from "../schemas";

export async function updateDoctor(payload: UpdateDoctorPayload) {
  try {
    const { id, ...updateData } = payload;

    const response = await api.put<Result<DoctorResponse>>(
      ["/doctors", id].join("/"),
      updateData,
    );

    if (response.data.success) {
      return success<DoctorResponse>(response.data.data);
    } else return failure(response.data.error);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro ao atualizar o médico.");
  }
}
