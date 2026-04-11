import { AppError, Either } from '@shared/core';
import { Doctor } from '../doctor.domain.js';

export interface IDoctorRepository {
  create(doctor: Doctor): Promise<Either<AppError, Doctor>>;
  findById(id: string): Promise<Either<AppError, Doctor | null>>;
  findByCrm(crm: string): Promise<Either<AppError, Doctor | null>>;
  list(): Promise<Either<AppError, Doctor[]>>;
  save(doctor: Doctor): Promise<Either<AppError, Doctor>>;
  softDelete(id: string): Promise<Either<AppError, void>>;
}
