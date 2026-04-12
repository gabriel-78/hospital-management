import { Patients } from "../modules/patient/pages/Patients";
import { useSessionStore } from "@/stores";
import { SessionLayout } from "@/components/Layouts/SessionLayout";
import { AppLayout } from "@/components/Layouts/AppLayout";
import { PatientLayout } from "@/components/Layouts/PatientLayout";
import { Doctors } from "@/modules/doctor/pages/Doctors";
import { ScheduleConsultations } from "@/modules/consultation/pages/ScheduleConsultations";

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
        {session.session === "doctor" ? <Doctors /> : <Patients />}
      </SessionLayout>
    );
  }
}
