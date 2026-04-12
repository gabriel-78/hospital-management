import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SessionState {
  session: "doctor" | "patient" | null;
  changeSession: (value: "doctor" | "patient") => void;
  cleanSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      changeSession: (value: "doctor" | "patient") => set({ session: value }),
      cleanSession: () => set({ session: null }),
    }),
    {
      name: "session-storage",
    },
  ),
);
