import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Onboarding from "./pages/Onboarding";
import CoachDashboard from "./pages/CoachDashboard";
import ClientShell from "./pages/ClientShell";

import Home from "./pages/Home";
import Food from "./pages/Food";
import Training from "./pages/Training";
import Progress from "./pages/Progress";
import Account from "./pages/Account";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Navigate to="/onboarding" />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Coach */}
        <Route path="/coach" element={<CoachDashboard />} />

        {/* Client App */}
        <Route path="/app" element={<ClientShell />}>
          <Route index element={<Home />} />
          <Route path="food" element={<Food />} />
          <Route path="training" element={<Training />} />
          <Route path="progress" element={<Progress />} />
          <Route path="account" element={<Account />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/onboarding" />} />

      </Routes>
    </BrowserRouter>
  );
}
