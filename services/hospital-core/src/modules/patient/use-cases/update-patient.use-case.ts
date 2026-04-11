import { AppError, Either, isLeft, makeLeft, Name } from '@shared/core';
import { Patient } from '../patient.domain.js';
import { IPatientRepository } from '../infra/patient.repository.js';

export interface UpdatePatientDTO {
  name?: string;
}

export class UpdatePatientUseCase {
  constructor(private repository: IPatientRepository) {}

  async execute(id: string, dto: UpdatePatientDTO): Promise<Either<AppError, Patient>> {
    const findResult = await this.repository.findById(id);
    if (isLeft(findResult)) return makeLeft(findResult.left);
    if (findResult.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'PATIENT_NOT_FOUND'));
    }

    const existing = findResult.right;
    let name = existing.name;

    if (dto.name !== undefined) {
      const nameResult = Name.tryCreate(dto.name);
      if (isLeft(nameResult)) return makeLeft(nameResult.left);
      name = nameResult.right;
    }

    const updatedResult = Patient.tryCreate({
      ...existing.props,
      name,
      updatedAt: new Date(),
    });
    if (isLeft(updatedResult)) return makeLeft(updatedResult.left);

    return this.repository.save(updatedResult.right);
  }
}
