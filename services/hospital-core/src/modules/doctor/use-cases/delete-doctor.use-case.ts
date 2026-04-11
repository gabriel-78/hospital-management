import { AppError, Either, isLeft, makeLeft } from '@shared/core';
import { IDoctorRepository } from '../infra/doctor.repository.js';

export class DeleteDoctorUseCase {
  constructor(private repository: IDoctorRepository) {}

  async execute(id: string): Promise<Either<AppError, void>> {
    const findResult = await this.repository.findById(id);
    if (isLeft(findResult)) return makeLeft(findResult.left);
    if (findResult.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'DOCTOR_NOT_FOUND'));
    }
    return this.repository.softDelete(id);
  }
}
