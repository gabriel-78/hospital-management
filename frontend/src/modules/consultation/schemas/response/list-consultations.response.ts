import z from "zod";
import { ConsultationResponseSchema } from "./consultation.response";

export const ListConsultationsResponseSchema = z.array(ConsultationResponseSchema);

export type ListConsultationsResponse = z.infer<typeof ListConsultationsResponseSchema>;
