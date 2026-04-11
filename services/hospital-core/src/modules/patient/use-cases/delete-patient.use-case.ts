import { AppError, Either, isLeft, makeLeft } from '@shared/core';
import { IPatientRepository } from '../infra/patient.repository.js';

export class DeletePatientUseCase {
  constructor(private repository: IPatientRepository) {}

  async execute(id: string): Promise<Either<AppError, void>> {
    const findResult = await this.repository.findById(id);
    if (isLeft(findResult)) return makeLeft(findResult.left);
    if (findResult.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'PATIENT_NOT_FOUND'));
    }
    return this.repository.softDelete(id);
  }
}
