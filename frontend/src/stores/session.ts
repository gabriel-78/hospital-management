import type { PatientResponse } from "@/modules/patient/schemas";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SessionState {
  session: "doctor" | "patient" | null;
  changeSession: (value: "doctor" | "patient") => void;
  cleanSession: () => void;
  patient: PatientResponse | null;
  changePatient: (value: PatientResponse) => void;
  cleanPatient: () => void;
  doctor: null;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      changeSession: (value: "doctor" | "patient") => set({ session: value }),
      cleanSession: () => set({ session: null }),
      patient: null,
      changePatient: (value: PatientResponse) => set({ patient: value }),
      cleanPatient: () => set({ patient: null, session: "patient" }),
      doctor: null,
    }),
    {
      name: "session-storage",
    },
  ),
);
