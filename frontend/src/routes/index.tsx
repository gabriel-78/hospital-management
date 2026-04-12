import { AppLayout } from "@/components/Layouts/AppLayout";
import { RootPage } from "@/pages/RootPage";
import { ScheduleConsultations } from "@/pages/ScheduleConsultations";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function RoutesComponent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootPage />} />

        <Route element={<AppLayout />}>
          <Route path="/transactions" element={<ScheduleConsultations />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default RoutesComponent;
