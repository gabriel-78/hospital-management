import { api } from "@/infra/api";
import type { AxiosError } from "axios";
import { failure, success, type Result } from "@/shared/result";
import {
  ListPharmaProductsResponseSchema,
  type ListPharmaProductsResponse,
} from "../schemas/response";
import type { ListPharmaProductsPayload } from "../schemas/payload";

export async function getListPharmaProducts(filters?: ListPharmaProductsPayload) {
  try {
    const response = await api.get<Result<ListPharmaProductsResponse>>(
      "/integrations/pharma/products",
      {
        params: filters,
        paramsSerializer: (params) => {
          const search = new URLSearchParams();
          params.ids?.forEach((id: string) => search.append("ids", id));
          params.names?.forEach((n: string) => search.append("names", n));
          params.activeIngredients?.forEach((ai: string) =>
            search.append("activeIngredients", ai),
          );
          return search.toString();
        },
      },
    );

    if (response.data.success) {
      const parsedValue = ListPharmaProductsResponseSchema.parse(
        response.data.data,
      );
      return success<ListPharmaProductsResponse>(parsedValue);
    } else return failure(response.data.error);
  } catch (err) {
    const error = err as AxiosError<string>;
    throw failure(error.message ?? "Erro ao requisitar os produtos");
  }
}
