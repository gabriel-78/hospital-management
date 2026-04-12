import z from "zod";

export const DeleteDoctorPayloadSchema = z.object({
  id: z.string(),
});

export type DeleteDoctorPayload = z.infer<typeof DeleteDoctorPayloadSchema>;
