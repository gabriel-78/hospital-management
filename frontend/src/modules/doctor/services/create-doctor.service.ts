import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import type { CreateDoctorPayload, DoctorResponse } from "../schemas";

export async function createDoctor(payload: CreateDoctorPayload) {
  try {
    const response = await api.post<Result<DoctorResponse>>(
      ["/doctors"].join("/"),
      payload,
    );

    if (response.data.success) {
      return success<DoctorResponse>(response.data.data);
    } else return failure(response.data.error);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro a requisitar os médicos");
  }
}
