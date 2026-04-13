import { Consultation } from '../consultation.domain.js';
import { ConsultationListItem } from '../infra/consultation.repository.js';
import {
  CancelConsultationOutput,
  CompleteConsultationOutput,
  ConsultationOutput,
  CreateConsultationOutput,
  FindConsultationByIdOutput,
  ListConsultationsOutput,
  RescheduleConsultationOutput,
  cancelConsultationOutputSchema,
  completeConsultationOutputSchema,
  consultationOutputSchema,
  createConsultationOutputSchema,
  findConsultationByIdOutputSchema,
  listConsultationsOutputSchema,
  rescheduleConsultationOutputSchema,
} from '../schemas/index.js';

const toPlain = (consultation: Consultation): ConsultationOutput => ({
  id: consultation.id.value,
  doctorId: consultation.doctorId,
  patientId: consultation.patientId,
  scheduledAt: consultation.scheduledAt,
  status: consultation.status,
  createdAt: consultation.createdAt,
  updatedAt: consultation.updatedAt,
  deletedAt: consultation.deletedAt,
});

export class ConsultationPresenter {
  static toCreateOutput(consultation: Consultation): CreateConsultationOutput {
    return createConsultationOutputSchema.parse(toPlain(consultation));
  }

  static toFindByIdOutput(consultation: Consultation): FindConsultationByIdOutput {
    return findConsultationByIdOutputSchema.parse(toPlain(consultation));
  }

  static toListOutput(items: ConsultationListItem[]): ListConsultationsOutput {
    return listConsultationsOutputSchema.parse(
      items.map(({ consultation, doctorName, patientName }) => ({
        ...toPlain(consultation),
        doctorName,
        patientName,
      })),
    );
  }

  static toCancelOutput(consultation: Consultation): CancelConsultationOutput {
    return cancelConsultationOutputSchema.parse(toPlain(consultation));
  }

  static toCompleteOutput(consultation: Consultation): CompleteConsultationOutput {
    return completeConsultationOutputSchema.parse(toPlain(consultation));
  }

  static toRescheduleOutput(consultation: Consultation): RescheduleConsultationOutput {
    return rescheduleConsultationOutputSchema.parse(toPlain(consultation));
  }
}
