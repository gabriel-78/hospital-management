import z from "zod";
import { ConsultationResponseSchema } from "./consultation.response";

export const ConsultationListItemResponseSchema = ConsultationResponseSchema.extend({
  doctorName: z.string(),
  patientName: z.string(),
});

export type ConsultationListItemResponse = z.infer<
  typeof ConsultationListItemResponseSchema
>;
