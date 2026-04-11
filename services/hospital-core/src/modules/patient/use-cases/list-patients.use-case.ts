import { AppError, Either } from '@shared/core';
import { Patient } from '../patient.domain.js';
import { IPatientRepository } from '../infra/patient.repository.js';

export class ListPatientsUseCase {
  constructor(private repository: IPatientRepository) {}

  async execute(): Promise<Either<AppError, Patient[]>> {
    return this.repository.list();
  }
}
