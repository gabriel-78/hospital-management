import axios, { AxiosInstance, isAxiosError } from 'axios';
import { AppError, Either, makeLeft, makeRight } from '@shared/core';
import { PharmaApiResponse, PharmaListProductsFilters, PharmaProductRaw } from './pharma.types.js';

export class PharmaClient {
  private readonly http: AxiosInstance;

  constructor(baseURL: string) {
    this.http = axios.create({
      baseURL,
      timeout: 5000,
    });
  }

  async findProductById(id: string): Promise<Either<AppError, PharmaProductRaw | null>> {
    try {
      const response = await this.http.get<PharmaApiResponse<PharmaProductRaw>>(`/products/${id}`);
      return makeRight(response.data.data);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          return makeRight(null);
        }

        if (error.response) {
          return makeLeft(
            new AppError('INTEGRATION_ERROR', 'PHARMA_SERVICE_ERROR', {
              status: error.response.status,
              data: error.response.data,
            }),
          );
        }

        return makeLeft(
          new AppError('INTEGRATION_UNAVAILABLE', 'PHARMA_SERVICE_UNAVAILABLE', {
            cause: error.code,
          }),
        );
      }

      return makeLeft(
        new AppError('INTEGRATION_ERROR', 'PHARMA_SERVICE_UNEXPECTED_ERROR', { cause: error }),
      );
    }
  }

  async listProducts(
    filters?: PharmaListProductsFilters,
  ): Promise<Either<AppError, PharmaProductRaw[]>> {
    try {
      const response = await this.http.get<PharmaApiResponse<PharmaProductRaw[]>>('/products', {
        params: filters,
        paramsSerializer: {
          serialize: (params: PharmaListProductsFilters) => {
            const searchParams = new URLSearchParams();
            for (const [key, value] of Object.entries(params)) {
              if (Array.isArray(value)) {
                value.forEach((v) => searchParams.append(key, v));
              }
            }
            return searchParams.toString();
          },
        },
      });
      return makeRight(response.data.data);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          return makeLeft(
            new AppError('INTEGRATION_ERROR', 'PHARMA_SERVICE_ERROR', {
              status: error.response.status,
              data: error.response.data,
            }),
          );
        }

        return makeLeft(
          new AppError('INTEGRATION_UNAVAILABLE', 'PHARMA_SERVICE_UNAVAILABLE', {
            cause: error.code,
          }),
        );
      }

      return makeLeft(
        new AppError('INTEGRATION_ERROR', 'PHARMA_SERVICE_UNEXPECTED_ERROR', { cause: error }),
      );
    }
  }
}
