import { AppError, Either, isLeft, makeLeft, makeRight } from '@shared/core';
import { prisma } from '@/infra/database/prisma.js';
import { PrescriptionItem } from '../prescription-item.domain.js';
import {
  ConsultationResultWithPrescription,
  CreateConsultationResultData,
  IConsultationResultRepository,
  PrescriptionWithItems,
} from './consultation-result.repository.js';
import { ConsultationResultMapper } from './consultation-result.mapper.js';
import { PrescriptionMapper } from './prescription.mapper.js';
import { PrescriptionItemMapper } from './prescription-item.mapper.js';

export class PrismaConsultationResultRepository implements IConsultationResultRepository {
  async create(
    data: CreateConsultationResultData,
  ): Promise<Either<AppError, ConsultationResultWithPrescription>> {
    const raw = await prisma.consultationResult.create({
      data: {
        id: data.consultationResult.id.value,
        consultationId: data.consultationResult.consultationId,
        description: data.consultationResult.description,
        createdAt: data.consultationResult.createdAt,
        ...(data.prescription
          ? {
              prescription: {
                create: {
                  id: data.prescription.prescription.id.value,
                  createdAt: data.prescription.prescription.createdAt,
                  items: {
                    create: data.prescription.items.map((item) => ({
                      id: item.id.value,
                      ...(item.remedyId ? { remedyId: item.remedyId } : {}),
                      medication: item.medication,
                      dosage: item.dosage,
                      duration: item.duration,
                      ...(item.instructions ? { instructions: item.instructions } : {}),
                    })),
                  },
                },
              },
            }
          : {}),
      },
      include: {
        prescription: { include: { items: true } },
      },
    });

    return this.mapToResult(raw);
  }

  async findByConsultationId(
    consultationId: string,
  ): Promise<Either<AppError, ConsultationResultWithPrescription | null>> {
    const raw = await prisma.consultationResult.findFirst({
      where: { consultationId, deletedAt: null },
      include: {
        prescription: { include: { items: true } },
      },
    });

    if (!raw) return makeRight(null);

    return this.mapToResult(raw);
  }

  private mapToResult(raw: any): Either<AppError, ConsultationResultWithPrescription> {
    const consultationResultResult = ConsultationResultMapper.toDomain(raw);
    if (isLeft(consultationResultResult)) return makeLeft(consultationResultResult.left);

    let prescription: PrescriptionWithItems | null = null;

    if (raw.prescription) {
      const prescriptionResult = PrescriptionMapper.toDomain(raw.prescription);
      if (isLeft(prescriptionResult)) return makeLeft(prescriptionResult.left);

      const items: PrescriptionItem[] = [];
      for (const rawItem of raw.prescription.items) {
        const itemResult = PrescriptionItemMapper.toDomain(rawItem);
        if (isLeft(itemResult)) return makeLeft(itemResult.left);
        items.push(itemResult.right);
      }

      prescription = { prescription: prescriptionResult.right, items };
    }

    return makeRight({
      consultationResult: consultationResultResult.right,
      prescription,
    });
  }
}
