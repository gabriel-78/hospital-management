import { PrescriptionItem } from '../prescription-item.domain.js';
import {
  ConsultationResultWithPrescription,
  PrescriptionWithItems,
} from '../infra/consultation-result.repository.js';
import {
  ConsultationResultOutput,
  CreateConsultationResultOutput,
  FindConsultationResultByConsultationIdOutput,
  PrescriptionItemOutput,
  PrescriptionOutput,
  createConsultationResultOutputSchema,
  findConsultationResultByConsultationIdOutputSchema,
} from '../schemas/index.js';

const toPrescriptionItemPlain = (item: PrescriptionItem): PrescriptionItemOutput => ({
  id: item.id.value,
  prescriptionId: item.prescriptionId,
  remedyId: item.remedyId,
  medication: item.medication,
  dosage: item.dosage,
  duration: item.duration,
  instructions: item.instructions,
});

const toPrescriptionPlain = (data: PrescriptionWithItems): PrescriptionOutput => ({
  id: data.prescription.id.value,
  consultationResultId: data.prescription.consultationResultId,
  createdAt: data.prescription.createdAt,
  deletedAt: data.prescription.deletedAt,
  items: data.items.map(toPrescriptionItemPlain),
});

const toPlain = (data: ConsultationResultWithPrescription): ConsultationResultOutput => ({
  id: data.consultationResult.id.value,
  consultationId: data.consultationResult.consultationId,
  description: data.consultationResult.description,
  createdAt: data.consultationResult.createdAt,
  deletedAt: data.consultationResult.deletedAt,
  prescription: data.prescription ? toPrescriptionPlain(data.prescription) : null,
});

export class ConsultationResultPresenter {
  static toCreateOutput(data: ConsultationResultWithPrescription): CreateConsultationResultOutput {
    return createConsultationResultOutputSchema.parse(toPlain(data));
  }

  static toFindByConsultationIdOutput(
    data: ConsultationResultWithPrescription,
  ): FindConsultationResultByConsultationIdOutput {
    return findConsultationResultByConsultationIdOutputSchema.parse(toPlain(data));
  }
}
