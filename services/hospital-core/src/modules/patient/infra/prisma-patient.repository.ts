import { AppError, Either, isLeft, makeLeft, makeRight } from '@shared/core';
import { prisma } from '@/infra/database/prisma.js';
import { Patient } from '../patient.domain.js';
import { IPatientRepository } from './patient.repository.js';
import { PatientMapper } from './patient.mapper.js';

export class PrismaPatientRepository implements IPatientRepository {
  async create(patient: Patient): Promise<Either<AppError, Patient>> {
    const data = PatientMapper.toPersistence(patient);

    const raw = await prisma.patient.create({ data });

    const result = PatientMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async findById(id: string): Promise<Either<AppError, Patient | null>> {
    const raw = await prisma.patient.findFirst({ where: { id, deletedAt: null } });

    if (!raw) return makeRight(null);

    const result = PatientMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async list(): Promise<Either<AppError, Patient[]>> {
    const rows = await prisma.patient.findMany({ where: { deletedAt: null } });

    const patients: Patient[] = [];

    for (const raw of rows) {
      const result = PatientMapper.toDomain(raw);
      if (isLeft(result)) return makeLeft(result.left);
      patients.push(result.right);
    }

    return makeRight(patients);
  }

  async save(patient: Patient): Promise<Either<AppError, Patient>> {
    const data = PatientMapper.toPersistence(patient);

    const raw = await prisma.patient.update({
      where: { id: data.id },
      data: {
        name: data.name,
        updatedAt: new Date(),
      },
    });

    const result = PatientMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async softDelete(id: string): Promise<Either<AppError, void>> {
    await prisma.patient.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return makeRight(undefined);
  }
}
