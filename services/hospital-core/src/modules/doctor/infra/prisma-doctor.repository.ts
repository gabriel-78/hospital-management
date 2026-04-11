import { AppError, Either, isLeft, makeLeft, makeRight } from '@shared/core';
import { prisma } from '@/infra/database/prisma.js';
import { Doctor } from '../doctor.domain.js';
import { IDoctorRepository } from './doctor.repository.js';
import { DoctorMapper } from './doctor.mapper.js';

export class PrismaDoctorRepository implements IDoctorRepository {
  async create(doctor: Doctor): Promise<Either<AppError, Doctor>> {
    const data = DoctorMapper.toPersistence(doctor);

    const raw = await prisma.doctor.create({ data });

    const result = DoctorMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async findById(id: string): Promise<Either<AppError, Doctor | null>> {
    const raw = await prisma.doctor.findFirst({ where: { id, deletedAt: null } });

    if (!raw) return makeRight(null);

    const result = DoctorMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async findByCrm(crm: string): Promise<Either<AppError, Doctor | null>> {
    const raw = await prisma.doctor.findFirst({ where: { crm, deletedAt: null } });

    if (!raw) return makeRight(null);

    const result = DoctorMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async list(): Promise<Either<AppError, Doctor[]>> {
    const rows = await prisma.doctor.findMany({ where: { deletedAt: null } });

    const doctors: Doctor[] = [];

    for (const raw of rows) {
      const result = DoctorMapper.toDomain(raw);
      if (isLeft(result)) return makeLeft(result.left);
      doctors.push(result.right);
    }

    return makeRight(doctors);
  }

  async save(doctor: Doctor): Promise<Either<AppError, Doctor>> {
    const data = DoctorMapper.toPersistence(doctor);

    const raw = await prisma.doctor.update({
      where: { id: data.id },
      data: {
        name: data.name,
        crm: data.crm,
        updatedAt: new Date(),
      },
    });

    const result = DoctorMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async softDelete(id: string): Promise<Either<AppError, void>> {
    await prisma.doctor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return makeRight(undefined);
  }
}
