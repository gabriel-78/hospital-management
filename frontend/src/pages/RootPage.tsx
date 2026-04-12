import { Patients } from "../modules/patient/pages/Patients";
import { useSessionStore } from "@/stores";
import { SessionLayout } from "@/components/Layouts/SessionLayout";

export function RootPage() {
  const session = useSessionStore((state) => state);

  return (
    <SessionLayout>
      {session.session === "doctor" ? <p>Em breve...</p> : <Patients />}
    </SessionLayout>
  );
}
