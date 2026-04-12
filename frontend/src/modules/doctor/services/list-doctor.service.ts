import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import {
  ListDoctorResponseSchema,
  type ListDoctorResponse,
} from "../schemas/response";

export async function getListDoctors() {
  try {
    const response = await api.get<Result<ListDoctorResponse>>("/doctors");

    if (response.data.success) {
      const parsedValue = ListDoctorResponseSchema.parse(response.data.data);

      return success<ListDoctorResponse>(parsedValue);
    } else return failure(response.data.error);
  } catch (err) {
    const error = err as AxiosError<string>;

    throw failure(error.message ?? "Erro a requisitar os médicos");
  }
}
