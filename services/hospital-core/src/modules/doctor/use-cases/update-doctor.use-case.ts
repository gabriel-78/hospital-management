import { AppError, CRM, Either, isLeft, makeLeft, Name } from '@shared/core';
import { Doctor } from '../doctor.domain.js';
import { IDoctorRepository } from '../infra/doctor.repository.js';

export interface UpdateDoctorDTO {
  name?: string;
  crm?: string;
}

export class UpdateDoctorUseCase {
  constructor(private repository: IDoctorRepository) {}

  async execute(id: string, dto: UpdateDoctorDTO): Promise<Either<AppError, Doctor>> {
    const findResult = await this.repository.findById(id);
    if (isLeft(findResult)) return makeLeft(findResult.left);
    if (findResult.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'DOCTOR_NOT_FOUND'));
    }

    const existing = findResult.right;
    let name = existing.name;
    let crm = existing.crm;

    if (dto.name !== undefined) {
      const nameResult = Name.tryCreate(dto.name);
      if (isLeft(nameResult)) return makeLeft(nameResult.left);
      name = nameResult.right;
    }

    if (dto.crm !== undefined) {
      const crmResult = CRM.tryCreate(dto.crm);
      if (isLeft(crmResult)) return makeLeft(crmResult.left);

      const duplicateResult = await this.repository.findByCrm(crmResult.right.value);
      if (isLeft(duplicateResult)) return makeLeft(duplicateResult.left);
      if (duplicateResult.right !== null && duplicateResult.right.id.value !== id) {
        return makeLeft(new AppError('DOMAIN_ERROR', 'DOCTOR_CRM_ALREADY_EXISTS'));
      }

      crm = crmResult.right;
    }

    const updatedResult = Doctor.tryCreate({
      ...existing.props,
      name,
      crm,
      updatedAt: new Date(),
    });
    if (isLeft(updatedResult)) return makeLeft(updatedResult.left);

    return this.repository.save(updatedResult.right);
  }
}
