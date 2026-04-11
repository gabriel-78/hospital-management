import { ConsultationStatus } from '@prisma/client';
import { AppError, Either, isLeft, makeLeft, makeRight } from '@shared/core';
import { prisma } from '@/infra/database/prisma.js';
import { Consultation } from '../consultation.domain.js';
import { IConsultationRepository } from './consultation.repository.js';
import { ConsultationMapper } from './consultation.mapper.js';

export class PrismaConsultationRepository implements IConsultationRepository {
  async create(consultation: Consultation): Promise<Either<AppError, Consultation>> {
    const data = ConsultationMapper.toPersistence(consultation);

    const raw = await prisma.consultation.create({ data });

    const result = ConsultationMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async findById(id: string): Promise<Either<AppError, Consultation | null>> {
    const raw = await prisma.consultation.findFirst({ where: { id, deletedAt: null } });

    if (!raw) return makeRight(null);

    const result = ConsultationMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async findConflictingForDoctor(
    doctorId: string,
    scheduledAt: Date,
    excludeId?: string,
  ): Promise<Either<AppError, Consultation | null>> {
    const raw = await prisma.consultation.findFirst({
      where: {
        doctorId,
        scheduledAt,
        deletedAt: null,
        status: { not: ConsultationStatus.CANCELLED },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });

    if (!raw) return makeRight(null);

    const result = ConsultationMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async findConflictingForPatient(
    patientId: string,
    scheduledAt: Date,
    excludeId?: string,
  ): Promise<Either<AppError, Consultation | null>> {
    const raw = await prisma.consultation.findFirst({
      where: {
        patientId,
        scheduledAt,
        deletedAt: null,
        status: { not: ConsultationStatus.CANCELLED },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });

    if (!raw) return makeRight(null);

    const result = ConsultationMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async list(): Promise<Either<AppError, Consultation[]>> {
    const rows = await prisma.consultation.findMany({ where: { deletedAt: null } });

    const consultations: Consultation[] = [];

    for (const raw of rows) {
      const result = ConsultationMapper.toDomain(raw);
      if (isLeft(result)) return makeLeft(result.left);
      consultations.push(result.right);
    }

    return makeRight(consultations);
  }

  async save(consultation: Consultation): Promise<Either<AppError, Consultation>> {
    const data = ConsultationMapper.toPersistence(consultation);

    const raw = await prisma.consultation.update({
      where: { id: data.id },
      data: {
        scheduledAt: data.scheduledAt,
        status: data.status,
        updatedAt: new Date(),
      },
    });

    const result = ConsultationMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async softDelete(id: string): Promise<Either<AppError, void>> {
    await prisma.consultation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return makeRight(undefined);
  }
}
