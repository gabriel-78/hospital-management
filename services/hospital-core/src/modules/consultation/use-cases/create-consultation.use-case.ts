import { AppError, Either, isLeft, makeLeft, makeRight } from '@shared/core';
import { Consultation, ConsultationStatusEnum } from '../consultation.domain.js';
import { IConsultationRepository } from '../infra/consultation.repository.js';
import { IDoctorRepository } from '../../doctor/infra/doctor.repository.js';
import { IPatientRepository } from '../../patient/infra/patient.repository.js';
import { CreateConsultationInput } from '../schemas/index.js';

export class CreateConsultationUseCase {
  constructor(
    private consultationRepository: IConsultationRepository,
    private doctorRepository: IDoctorRepository,
    private patientRepository: IPatientRepository,
  ) {}

  async execute(dto: CreateConsultationInput): Promise<Either<AppError, Consultation>> {
    const validationResult = await this.validate(dto);
    if (isLeft(validationResult)) return makeLeft(validationResult.left);

    const consultationResult = Consultation.tryCreate({
      doctorId: dto.doctorId,
      patientId: dto.patientId,
      scheduledAt: dto.scheduledAt,
      status: ConsultationStatusEnum.SCHEDULED,
    });
    if (isLeft(consultationResult)) return makeLeft(consultationResult.left);

    return this.consultationRepository.create(consultationResult.right);
  }

  private async validate(dto: CreateConsultationInput): Promise<Either<AppError, void>> {
    if (dto.scheduledAt <= new Date()) {
      return makeLeft(new AppError('DOMAIN_ERROR', 'CONSULTATION_SCHEDULED_AT_MUST_BE_FUTURE'));
    }

    const doctorResult = await this.doctorRepository.findById(dto.doctorId);
    if (isLeft(doctorResult)) return makeLeft(doctorResult.left);
    if (doctorResult.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'DOCTOR_NOT_FOUND'));
    }

    const patientResult = await this.patientRepository.findById(dto.patientId);
    if (isLeft(patientResult)) return makeLeft(patientResult.left);
    if (patientResult.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'PATIENT_NOT_FOUND'));
    }

    const doctorConflictResult = await this.consultationRepository.findConflictingForDoctor(
      dto.doctorId,
      dto.scheduledAt,
    );
    if (isLeft(doctorConflictResult)) return makeLeft(doctorConflictResult.left);
    if (doctorConflictResult.right !== null) {
      return makeLeft(new AppError('DOMAIN_ERROR', 'DOCTOR_ALREADY_HAS_CONSULTATION_AT_THIS_TIME'));
    }

    const patientConflictResult = await this.consultationRepository.findConflictingForPatient(
      dto.patientId,
      dto.scheduledAt,
    );
    if (isLeft(patientConflictResult)) return makeLeft(patientConflictResult.left);
    if (patientConflictResult.right !== null) {
      return makeLeft(
        new AppError('DOMAIN_ERROR', 'PATIENT_ALREADY_HAS_CONSULTATION_AT_THIS_TIME'),
      );
    }

    return makeRight(undefined);
  }
}
