import { AppError, CRM, Either, isLeft, makeLeft, Name } from '@shared/core';
import { Doctor } from '../doctor.domain.js';
import { IDoctorRepository } from '../infra/doctor.repository.js';

export interface CreateDoctorDTO {
  name: string;
  crm: string;
}

export class CreateDoctorUseCase {
  constructor(private repository: IDoctorRepository) {}

  async execute(dto: CreateDoctorDTO): Promise<Either<AppError, Doctor>> {
    const crmResult = CRM.tryCreate(dto.crm);
    if (isLeft(crmResult)) return makeLeft(crmResult.left);

    const existingResult = await this.repository.findByCrm(crmResult.right.value);
    if (isLeft(existingResult)) return makeLeft(existingResult.left);
    if (existingResult.right !== null) {
      return makeLeft(new AppError('DOMAIN_ERROR', 'DOCTOR_CRM_ALREADY_EXISTS'));
    }

    const nameResult = Name.tryCreate(dto.name);
    if (isLeft(nameResult)) return makeLeft(nameResult.left);

    const doctorResult = Doctor.tryCreate({
      name: nameResult.right,
      crm: crmResult.right,
    });
    if (isLeft(doctorResult)) return makeLeft(doctorResult.left);

    return this.repository.create(doctorResult.right);
  }
}
