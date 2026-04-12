import { AppLayout } from "@/components/Layouts/AppLayout";
import { ScheduleConsultations } from "./ScheduleConsultations";

export function RootPage() {
  return (
    <AppLayout>
      <ScheduleConsultations />
    </AppLayout>
  );
}
