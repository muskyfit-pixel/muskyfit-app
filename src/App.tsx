import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ClientShell from "./pages/ClientShell";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import CoachDashboard from "./pages/CoachDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Client app */}
        <Route path="/app/*" element={<ClientShell />} />

        {/* Coach */}
        <Route path="/coach" element={<CoachDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
