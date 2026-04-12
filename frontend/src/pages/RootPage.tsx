import { AppLayout } from "@/components/Layouts/AppLayout";
import { Patients } from "../modules/patient/pages/Patients";

export function RootPage() {
  return (
    <AppLayout>
      <Patients />
    </AppLayout>
  );
}
