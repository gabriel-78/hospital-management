import { AppError, Either } from '@shared/core';
import { Patient } from '../patient.domain.js';

export interface IPatientRepository {
  create(patient: Patient): Promise<Either<AppError, Patient>>;
  findById(id: string): Promise<Either<AppError, Patient | null>>;
  list(): Promise<Either<AppError, Patient[]>>;
  save(patient: Patient): Promise<Either<AppError, Patient>>;
  softDelete(id: string): Promise<Either<AppError, void>>;
}
