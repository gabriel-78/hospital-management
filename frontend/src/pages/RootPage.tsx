import { Patients } from "../modules/patient/pages/Patients";
import { useSessionStore } from "@/stores";
import { SessionLayout } from "@/components/Layouts/SessionLayout";
import { AppLayout } from "@/components/Layouts/AppLayout";
import { ScheduleConsultations } from "./ScheduleConsultations";
import { PatientLayout } from "@/components/Layouts/PatientLayout";

export function RootPage() {
  const session = useSessionStore((state) => state);

  if (session.session === "patient" && session.patient) {
    return (
      <PatientLayout>
        <ScheduleConsultations />
      </PatientLayout>
    );
  } else if (session.session === "doctor" && session.doctor) {
    return (
      <AppLayout>
        <p>Em breve...</p>
      </AppLayout>
    );
  } else {
    return (
      <SessionLayout>
        {session.session === "doctor" ? <p>Em breve...</p> : <Patients />}
      </SessionLayout>
    );
  }
}
