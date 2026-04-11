import { AppError, Either } from '@shared/core';
import { Doctor } from '../doctor.domain.js';
import { IDoctorRepository } from '../infra/doctor.repository.js';

export class ListDoctorsUseCase {
  constructor(private repository: IDoctorRepository) {}

  async execute(): Promise<Either<AppError, Doctor[]>> {
    return this.repository.list();
  }
}
