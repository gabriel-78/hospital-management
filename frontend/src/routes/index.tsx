import { DoctorLayout } from "@/components/Layouts/DoctorLayout";
import { PatientLayout } from "@/components/Layouts/PatientLayout";
import { RootPage } from "@/pages/RootPage";
import { ScheduleConsultations } from "@/modules/consultation/pages/ScheduleConsultations";
import { ConsultationHistory } from "@/modules/consultation/pages/ConsultationHistory";
import { useSessionStore } from "@/stores";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function RoutesComponent() {
  const session = useSessionStore((state) => state);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootPage />} />

        <Route
          element={
            session.session === "doctor" ? <DoctorLayout /> : <PatientLayout />
          }
        >
          <Route path="/consultations" element={<ScheduleConsultations />} />
          <Route path="/history" element={<ConsultationHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default RoutesComponent;
