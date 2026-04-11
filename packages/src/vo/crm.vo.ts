import { Either, isLeft, makeLeft, makeRight } from "../base/either.js";
import { AppError } from "../base/appError.js";
import { ValueObject, ValueObjectConfig } from "./base.js";

const VALID_UFS = new Set([
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]);

export class CRM extends ValueObject<string, ValueObjectConfig> {
  private static readonly CRM_REGEX = /^(\d{4,6})-([A-Z]{2})$/;

  private constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(value: string, config?: ValueObjectConfig): CRM {
    const result = CRM.tryCreate(value, config);
    if (isLeft(result)) throw result.left;
    return result.right;
  }

  public static tryCreate(
    value: string,
    config?: ValueObjectConfig,
  ): Either<AppError, CRM> {
    if (value === null || value === undefined) {
      return makeLeft(new AppError("VALIDATION_ERROR", "CRM_REQUIRED"));
    }

    if (typeof value !== "string") {
      return makeLeft(new AppError("VALIDATION_ERROR", "CRM_MUST_BE_STRING"));
    }

    const normalized = value.trim().toUpperCase();

    if (!normalized) {
      return makeLeft(new AppError("VALIDATION_ERROR", "CRM_REQUIRED"));
    }

    const match = CRM.CRM_REGEX.exec(normalized);

    if (!match) {
      return makeLeft(new AppError("VALIDATION_ERROR", "CRM_INVALID_FORMAT"));
    }

    const [, numero, uf] = match;

    if (!VALID_UFS.has(uf)) {
      return makeLeft(new AppError("VALIDATION_ERROR", "CRM_INVALID_UF"));
    }

    return makeRight(new CRM(`${numero}-${uf}`, config));
  }

  get numero(): string {
    return this.value.split("-")[0];
  }

  get uf(): string {
    return this.value.split("-")[1];
  }
}
