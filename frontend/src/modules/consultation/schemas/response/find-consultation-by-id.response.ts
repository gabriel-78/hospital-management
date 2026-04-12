import z from "zod";
import { ConsultationResponseSchema } from "./consultation.response";

export const FindConsultationByIdResponseSchema = ConsultationResponseSchema;

export type FindConsultationByIdResponse = z.infer<typeof FindConsultationByIdResponseSchema>;
