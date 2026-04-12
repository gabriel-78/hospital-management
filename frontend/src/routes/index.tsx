import { AppLayout } from "@/components/Layouts/AppLayout";
import { PatientLayout } from "@/components/Layouts/PatientLayout";
import { RootPage } from "@/pages/RootPage";
import { ScheduleConsultations } from "@/pages/ScheduleConsultations";
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
            session.session === "doctor" ? <AppLayout /> : <PatientLayout />
          }
        >
          <Route path="/consultations" element={<ScheduleConsultations />} />
          <Route path="/history" element={<span>Em breve</span>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default RoutesComponent;
