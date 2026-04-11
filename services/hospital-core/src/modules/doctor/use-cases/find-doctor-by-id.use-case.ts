import { AppError, Either, isLeft, makeLeft, makeRight } from '@shared/core';
import { Doctor } from '../doctor.domain.js';
import { IDoctorRepository } from '../infra/doctor.repository.js';

export class FindDoctorByIdUseCase {
  constructor(private repository: IDoctorRepository) {}

  async execute(id: string): Promise<Either<AppError, Doctor>> {
    const result = await this.repository.findById(id);
    if (isLeft(result)) return makeLeft(result.left);
    if (result.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'DOCTOR_NOT_FOUND'));
    }
    return makeRight(result.right);
  }
}
