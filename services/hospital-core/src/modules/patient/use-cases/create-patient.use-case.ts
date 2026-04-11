import { AppError, Either, isLeft, makeLeft, Name } from '@shared/core';
import { Patient } from '../patient.domain.js';
import { IPatientRepository } from '../infra/patient.repository.js';

export interface CreatePatientDTO {
  name: string;
}

export class CreatePatientUseCase {
  constructor(private repository: IPatientRepository) {}

  async execute(dto: CreatePatientDTO): Promise<Either<AppError, Patient>> {
    const nameResult = Name.tryCreate(dto.name);
    if (isLeft(nameResult)) return makeLeft(nameResult.left);

    const patientResult = Patient.tryCreate({ name: nameResult.right });
    if (isLeft(patientResult)) return makeLeft(patientResult.left);

    return this.repository.create(patientResult.right);
  }
}
