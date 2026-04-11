import { AppError, Either, isLeft, makeLeft, makeRight } from '@shared/core';
import { Patient } from '../patient.domain.js';
import { IPatientRepository } from '../infra/patient.repository.js';

export class FindPatientByIdUseCase {
  constructor(private repository: IPatientRepository) {}

  async execute(id: string): Promise<Either<AppError, Patient>> {
    const result = await this.repository.findById(id);
    if (isLeft(result)) return makeLeft(result.left);
    if (result.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'PATIENT_NOT_FOUND'));
    }
    return makeRight(result.right);
  }
}
