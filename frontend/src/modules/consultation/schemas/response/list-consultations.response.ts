import z from "zod";
import { ConsultationListItemResponseSchema } from "./consultation-list-item.response";

export const ListConsultationsResponseSchema = z.array(
  ConsultationListItemResponseSchema,
);

export type ListConsultationsResponse = z.infer<
  typeof ListConsultationsResponseSchema
>;
