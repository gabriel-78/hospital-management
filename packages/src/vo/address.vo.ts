import { AppError } from "../base/appError.js";
import { Either, isLeft, makeLeft, makeRight } from "../base/either.js";
import { ValueObject, ValueObjectConfig } from "./base.js";

export interface AddressProps {
  readonly street: string;
  readonly number: string;
  readonly complement?: string;
  readonly neighborhood: string;
  readonly city: string;
  readonly state: string;
  readonly zipCode: string;
}

export class Address extends ValueObject<AddressProps, ValueObjectConfig> {
  private static readonly ZIP_CODE_LENGTH = 8;
  private static readonly STATE_LENGTH = 2;

  private constructor(value: AddressProps, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(
    props: AddressProps,
    config?: ValueObjectConfig,
  ): Address {
    const result = Address.tryCreate(props, config);
    if (isLeft(result)) throw result.left;
    return result.right;
  }

  public static tryCreate(
    props: AddressProps,
    config?: ValueObjectConfig,
  ): Either<AppError, Address> {
    if (!props.street?.trim()) {
      return makeLeft(
        new AppError("VALIDATION_ERROR", "ADDRESS_STREET_REQUIRED"),
      );
    }
    if (!props.number?.trim()) {
      return makeLeft(
        new AppError("VALIDATION_ERROR", "ADDRESS_NUMBER_REQUIRED"),
      );
    }
    if (!props.neighborhood?.trim()) {
      return makeLeft(
        new AppError("VALIDATION_ERROR", "ADDRESS_NEIGHBORHOOD_REQUIRED"),
      );
    }
    if (!props.city?.trim()) {
      return makeLeft(
        new AppError("VALIDATION_ERROR", "ADDRESS_CITY_REQUIRED"),
      );
    }

    const state = props.state?.trim().toUpperCase();
    if (
      !state ||
      state.length !== Address.STATE_LENGTH ||
      !/^[A-Z]{2}$/.test(state)
    ) {
      return makeLeft(
        new AppError("VALIDATION_ERROR", "ADDRESS_STATE_INVALID"),
      );
    }

    const zipDigits = String(props.zipCode ?? "").replace(/\D/g, "");
    if (zipDigits.length !== Address.ZIP_CODE_LENGTH) {
      return makeLeft(
        new AppError("VALIDATION_ERROR", "ADDRESS_ZIP_CODE_INVALID"),
      );
    }

    return makeRight(
      new Address(
        {
          street: props.street.trim(),
          number: props.number.trim(),
          complement: props.complement?.trim(),
          neighborhood: props.neighborhood.trim(),
          city: props.city.trim(),
          state,
          zipCode: zipDigits,
        },
        config,
      ),
    );
  }

  get zipCodeFormatted(): string {
    const v = this.value.zipCode;
    return `${v.slice(0, 5)}-${v.slice(5)}`;
  }

  override equals(vo: ValueObject<AddressProps, ValueObjectConfig>): boolean {
    return (
      this.value.street === vo.value.street &&
      this.value.number === vo.value.number &&
      this.value.complement === vo.value.complement &&
      this.value.neighborhood === vo.value.neighborhood &&
      this.value.city === vo.value.city &&
      this.value.state === vo.value.state &&
      this.value.zipCode === vo.value.zipCode
    );
  }
}
