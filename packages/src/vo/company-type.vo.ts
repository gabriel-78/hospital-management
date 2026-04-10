import { Either, isLeft, makeLeft, makeRight } from "../base/either.js";
import { AppError } from "../base/appError.js";
import { ValueObject, ValueObjectConfig } from "./base.js";

export enum CompanyTypeEnum {
  HOSPITAL = "HOSPITAL",
  CLINIC = "CLINIC",
}

export class CompanyType extends ValueObject<
  CompanyTypeEnum,
  ValueObjectConfig
> {
  private constructor(value: CompanyTypeEnum, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(value: string, config?: ValueObjectConfig): CompanyType {
    const result = CompanyType.tryCreate(value, config);
    if (isLeft(result)) throw result.left;
    return result.right;
  }

  public static tryCreate(
    value: string,
    config?: ValueObjectConfig,
  ): Either<AppError, CompanyType> {
    const normalized = String(value ?? "")
      .trim()
      .toUpperCase();
    const validValues = Object.values(CompanyTypeEnum);
    if (!validValues.includes(normalized as CompanyTypeEnum)) {
      return makeLeft(
        new AppError(
          "VALIDATION_ERROR",
          `COMPANY_TYPE_INVALID: must be one of ${validValues.join(", ")}`,
        ),
      );
    }
    return makeRight(new CompanyType(normalized as CompanyTypeEnum, config));
  }

  get isHospital(): boolean {
    return this.value === CompanyTypeEnum.HOSPITAL;
  }

  get isClinic(): boolean {
    return this.value === CompanyTypeEnum.CLINIC;
  }
}
