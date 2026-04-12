export const ConsultationStatus = {
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
} as const;

export interface CreateConsultationInput {
  amount: number;
  date: string;
  description: string;
  type: keyof typeof ConsultationStatus;
  categoryId: string;
}

export interface UpdateConsultationInput {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: keyof typeof ConsultationStatus;
  categoryId: string;
}

export interface ListConsultationInput {
  description?: string;
  type?: keyof (typeof ConsultationStatus)[];
  categories?: string[];
  period?: { start: string; end: string };
}

export interface Consultation {
  amount: number;
  category?: string;
  categoryId: string;
  createdAt?: string;
  date: string;
  description: string;
  id: string;
  status: keyof typeof ConsultationStatus;
  updatedAt?: string;
  userId: string;
}
